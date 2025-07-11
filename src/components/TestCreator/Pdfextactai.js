import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase"; // adjust the path


pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function App() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

      const allResponses = [];
      setLoading(true);

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        // Convert canvas to image
        const imageDataUrl = canvas.toDataURL("image/png");

        // Run OCR using Tesseract
        const ocrResult = await Tesseract.recognize(imageDataUrl, "eng", {
          logger: (m) => console.log(`OCR progress [Page ${i}]:`, m),
        });

        const extractedText = ocrResult.data.text;
        console.log(`Page ${i} extracted OCR text:`, extractedText);

        // Send to Llama
        const aiResponse = await sendToLlama(extractedText, i);
        allResponses.push(`🧠 Page ${i} Response:\n${aiResponse}\n`);
      }

      setResponses(allResponses);
      setLoading(false);
    };
    fileReader.readAsArrayBuffer(file);
  };

  const sendToLlama = async (text, pageNumber) => {
  try {
    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer fef5a238-7a6d-4280-bb1d-3eb6485c0e56`, // Replace with your actual key
      },
      body: JSON.stringify({
        model: "Llama-4-Maverick-17B-128E-Instruct",
        messages: [
          {
            role: "system",
            content: `You are parsing a JEE Mains test PDF (Page ${pageNumber}). Extract questions in this format:

Q: <Question>
A. <Option1>
B. <Option2>
C. <Option3>
D. <Option4>
Answer: <Correct Option Letter>`,
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "";
    console.log("AI Response:", message);

    // 🔍 Extract each question from the response
    const questionBlocks = message.split(/Q\d*:/).slice(1); // removes prefix text

    const questionsRef = collection(firestore, "tests", 'harsh3', "questions");
    const snapshot = await getDocs(questionsRef);
    let currentCount = snapshot.size;

    for (const block of questionBlocks) {
      const qMatch = block.match(/^(.*?)(?:A\.|$)/s);
      const opts = [...block.matchAll(/([A-D])\.\s*(.*?)(?=(?:[A-D]\.|Answer:|$))/gs)];
      const ansMatch = block.match(/Answer:\s*([A-D])/i);

      const question = qMatch?.[1]?.trim() || "";
      const options = opts.map(([, , opt]) => opt.trim());
      const correctOptionLetter = ansMatch?.[1]?.toUpperCase() || "A";
      const correctIndex = ["A", "B", "C", "D"].indexOf(correctOptionLetter);

      currentCount++;
      const newQuestionID = `question${currentCount}`;

      const dataToSave = {
        subject: "",        // You can auto-detect or let user input later
        section: "",
        question,
        options,
        correctOption: correctIndex,
        displayType: "inline",
      };

      await setDoc(doc(questionsRef, newQuestionID), dataToSave);
    }

    return message;
  } catch (error) {
    console.error("Error talking to AI or saving:", error);
    return "❌ Error from AI or saving to Firestore.";
  }
};

  return (
    <div style={{ padding: 20 }}>
      <h2>📄 JEE PDF Extractor with OCR + AI</h2>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      {loading && <p>Processing PDF pages, please wait...</p>}
      {responses.map((res, idx) => (
        <pre
          key={idx}
          style={{ background: "#f4f4f4", padding: "1em", marginTop: "10px" }}
        >
          {res}
        </pre>
      ))}
    </div>
  );
}
