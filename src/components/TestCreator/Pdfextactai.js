import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { useNavigate } from 'react-router-dom';
import { collection, doc,updateDoc, setDoc, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase"; // adjust the path
import Image from "../Images/cloud-upload.png"; // adjust the path


pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function App({ testId, format }) {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  // State for the single selected PDF file
  const [selectedFile, setSelectedFile] = useState(null);
  // State to manage drag-over visual feedback
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState('');
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const navigate = useNavigate();

  

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];

    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setIsUploading('PDF Selected Successfully');
    } else {
      setSelectedFile(null); // Clear any previously selected file
      setIsUploading('Please select a PDF file only.');
    }
  }, []);

  const handleFileUpload = useCallback((event) => {
    const file = selectedFile;
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        setIsUploading(`Processing Page ${i}`);
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
        const ocrResult = await Tesseract.recognize(imageDataUrl, "eng");

        const extractedText = ocrResult.data.text;

        // Send to Llama
        const aiResponse = await sendToLlama(extractedText, i);
      }

    };
    fileReader.readAsArrayBuffer(file);
    event.target.value = null;


  }, [selectedFile]);

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
              content: `You are parsing a ${format} test paper question. Extract questions and its subject acc. to ${format} and cannot get more than 4 option:

Q: <Question>
A. <Option1>
B. <Option2>
C. <Option3>
D. <Option4>
Answer: <Correct Option Letter>
Subject : <Subject>`,
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
      // 🔍 Extract each question from the response
      const questionBlocks = message.split(/Q\d*:/).slice(1); // removes prefix text

      const questionsRef = collection(firestore, "tests", testId, "questions");
      const CreatedRef = doc(firestore, "tests", testId);
      await updateDoc(CreatedRef, {
        createdBy: 'AI',
      }, { merge: true });
      const snapshot = await getDocs(questionsRef);
      let currentCount = snapshot.size;

      for (const block of questionBlocks) {
        setIsUploading('Saving Questions ....');
        const cleanBlock = block.replace(/\*+/g, "").trim();

  const qMatch = cleanBlock.match(/^(.*?)(?=A\.)/s);
  const question = qMatch?.[1]?.trim() || "";

  const opts = [...cleanBlock.matchAll(/([A-D])\.\s*(.*?)(?=(?:[A-D]\.|Answer:|$))/gs)];
  const options = opts.map(([, , opt]) => opt.trim());

  const ansMatch = cleanBlock.match(/Answer:\s*([A-D])/i);
  const correctOptionLetter = ansMatch?.[1]?.toUpperCase() || "A";
  const correctIndex = ["A", "B", "C", "D"].indexOf(correctOptionLetter);

  const subjectMatch = cleanBlock.match(/Subject\s*:\s*(.*)/i);
  let subject = subjectMatch ? subjectMatch[1].trim() : "Uncategorized";

  // ✅ Normalize subject name: Remove content in parentheses
  subject = subject.replace(/\s*\(.*?\)/g, "").trim()

        currentCount++;
        const newQuestionID = `question${currentCount}`;

        const dataToSave = {
          subject,        // You can auto-detect or let user input later
          section: "MCQs",
          question,
          options,
          correctOption: correctIndex,
        };

        await setDoc(doc(questionsRef, newQuestionID), dataToSave);
      }

      return message;
    } catch (error) {
      console.error("Error talking to AI or saving:", error);
      return "❌ Error from AI or saving to Firestore.";
    }
    finally {
      setIsUploading('');
      setDropDownOpen(false);
      setSelectedFile(null);
      navigate(`/author/creation/${testId}/manage?PdftoTest`);
    }
  };

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, []);

  // Event handler for drag enter
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  // Event handler for drag leave
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  // Event handler for drag over
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Event handler for file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    // Get the first file from the dropped files
    const droppedFile = e.dataTransfer.files[0];

    // Check if a file was dropped and if it's a PDF
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setSelectedFile(droppedFile);
      setIsUploading('PDF file selected!');
    } else {
      setSelectedFile(null); // Clear any previously selected file
      setIsUploading
        ('Please drop a PDF file only.');
    }
  }, []);


  // Function to remove the currently selected file
  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setIsUploading('File removed.');
  }, []);

  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#3730a3" fill="none" onClick={() => { setDropDownOpen(false); setSelectedFile(null) }} style={{ cursor: 'pointer' }} className="ml-auto" >
      <path d="M12 2.00012C17.5228 2.00012 22 6.47727 22 12.0001C22 17.523 17.5228 22.0001 12 22.0001C6.47715 22.0001 2 17.523 2 12.0001M8.909 2.48699C7.9 2.8146 6.96135 3.29828 6.12153 3.90953M3.90943 6.12162C3.29806 6.9616 2.81432 7.90044 2.4867 8.90964" stroke="#3730a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M14.9994 15.0001L9 9.00012M9.00064 15.0001L15 9.00012" stroke="#3730a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  )

  return (
    <div className='drop-upload-container'>
      <div className="upload-banner">
        <h2>AI-Powered Test Generation</h2>
        <p className="text-xl opacity-90 mb-10 max-w-prose">
          Our AI-powered platform lets you upload any PDF and automatically generates comprehensive tests.
          Simply click the button below to get started.
        </p>
        <button onClick={() => setDropDownOpen(true)} style={{ background: '#cd6685' }}> Let's Go 🚀</button>
      </div>
      {dropDownOpen && (
        <div className='modal'>
          <div className="modal-content" style={{ padding: 35, maxWidth: '70%', height: '95%' }}>
            <div className="flex">
              <h2>Upload Your PDF</h2>
              <CloseIcon />
            </div>
            {!selectedFile ? (

              <div
                ref={dropZoneRef}
                className={isDragActive ? 'drop-zone-active' : 'drop-zone'}
                onClick={() => fileInputRef.current.click()} // Trigger file input click on drop zone click
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <img src={Image} alt="Upload Icon" style={{ height: 140, marginBottom: '10px' }} />
                <p className="mb-10">Drag You Test Files here to Start Making </p>
                <div className="mb-10 flex">
                  <div className="divider"></div><span style={{padding : '0 5px'}}>OR</span><div className="divider"></div>
                </div>
                <button>Browse Files</button>
                <input type="file" accept="application/pdf" className='hidden' ref={fileInputRef} onChange={handleFileSelect} />
                <div className='flex' style={{ width: '100%', marginTop: 'auto' }}>
                  <p>Supported Format : PDF (1) </p>
                  <p className='ml-auto'>Maximum Size : 50MB</p>
                </div>

              </div>

            ) : (
              <div>
                <div className="drop-zone mb-10">
                  <img src="https://www.shareicon.net/data/2016/07/03/636103_file_512x512.png" alt="photo" height="160px" />
                  <span style={{ color: 'var(--light)', maxWidth: "60%" }}>
                    <b>Selected File : </b>
                    {selectedFile.name}
                  </span>
                  <span className="mb-10"><b>File Size : </b>
                    {formatFileSize(selectedFile.size)}
                  </span>

                  <button onClick={handleRemoveFile}>Remove File</button>
                </div>
            <p className="created-by-ai">{isUploading} </p>
              </div>
            )}


            <button className='pdf-upload-btn' disabled={!selectedFile} onClick={handleFileUpload} >Upload</button>
          </div>
        </div>
      )}

    </div>
  );
}
