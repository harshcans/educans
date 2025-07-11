import React, { useState, useRef,useEffect } from "react";
import { firestore } from "../../firebase";
import { supabase } from "../../supabase";
import { useNavigate, useParams,useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import "../CSS/CreateQuestionForm.css";
import Pdfextactai from "./Pdfextactai";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function AddQuestionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadMode, setUploadMode] = useState("device"); // 'device' or 'link'
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctOption, setCorrectOption] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [manualImageURL, setManualImageURL] = useState("");
  const [uploadedImageURL, setUploadedImageURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState("");
  const fileInputRef = useRef();
const location = useLocation();
  const navigate = useNavigate();
  const { testID } = useParams();

  const handleNext = () => currentStep < 3 && setCurrentStep(currentStep + 1);
  const handlePrev = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden file input
  };

  const handleImageUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) return alert("Please select an image file.");

    try {
      setUploading(true);
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (error) throw error;

      setUploadedImageName(file.name); // <-- Only storing name now
      localStorage.setItem("uploadedImageName", file.name);
    } catch (err) {
      alert("Upload failed");
      console.error("image upload fail", err);
    } finally {
      setUploading(false);
    }
  };


  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const editParam = params.get('edit');
    // const qidParam = params.get('qid');
    const subjectParam = params.get('subject');
    const optionsStringParam = params.get('options');
    const correctOptionParam = params.get('correctOption');
    const sectionParam = params.get('section');

    setQuestion(editParam);
    setSection(sectionParam);
    setSubject(subjectParam);
    setCorrectOption(correctOptionParam);

    // For options, decode and parse the JSON string
    if (optionsStringParam) {
      try {
        const decodedOptionsString = decodeURIComponent(optionsStringParam);
        const parsedOptionsArray = JSON.parse(decodedOptionsString);
       setOption1(parsedOptionsArray[0] || ''); // Use || '' to prevent 'undefined' if an option is missing
        setOption2(parsedOptionsArray[1] || '');
        setOption3(parsedOptionsArray[2] || '');
        setOption4(parsedOptionsArray[3] || '');
        console.log("Decoded options:", parsedOptionsArray);
      } catch (error) {
        console.error("Error parsing options:", error);
        // setOptions([]); // Set to empty array on error
      }
    }

  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = [option1, option2, option3, option4];
    const correctIndex = parseInt(correctOption) - 1;

    if (
      !subject ||
      !section ||
      !question ||
      correctIndex < 0 ||
      correctIndex > 3
    ) {
      return alert("Please fill in all fields correctly.");
    }

    try {
      const questionsRef = firestore
        .collection("tests")
        .doc(testID)
        .collection("questions");
      const snapshot = await questionsRef.get();
      const questionCount = snapshot.size;
      const newQuestionID = `question${questionCount + 1}`;

      const dataToSave = {
        subject,
        section,
        question,
        options,
        correctOption: correctIndex,
        displayType: "inline",
      };

      if (manualImageURL) {
        dataToSave.imageURL = manualImageURL;
      } else if (uploadedImageName) {
        dataToSave.imageName = uploadedImageName;
      }

      await questionsRef.doc(newQuestionID).set(dataToSave);

      alert("Question added successfully!");
      navigate(`/author/creation/${testID}`);
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question.");
    }
  };

  return (
    <>

      <div className="flex">
        <Sidebar />
        <div className="main">
          <div className="header flex">
            <div className="row-right">
              <Popup
                trigger={<i className="fa-solid fa-bars" />}
                position="bottom left"
              >
                <Sidebar />
              </Popup>
              <h2>Add New Question</h2>
            </div>
            <div className="row-left">
              <i className="fa-regular fa-bell" />
              <i className="fa-solid fa-gear" />
              <i className="fa-regular fa-circle-user" />
            </div>
          </div>
          <Pdfextactai />
          <div className="main-wrapper">
            <form className="question-card" onSubmit={handleSubmit}>
              <div className="step-up flex">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`line-dash ${currentStep >= step ? "active-step" : ""
                      }`}
                  >
                    Step {step}
                  </div>
                ))}
              </div>

              {currentStep === 1 && (
                <div className="ques-fill">
                  <div className="writing-column">
                    <label>Choose Subject:</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    >
                      <option value="">Select Subject</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                    </select>

                    <label>Choose Section:</label>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      required
                    >
                      <option value="">Select Section</option>
                      <option value="Section 1">Section 1: MCQs</option>
                      <option value="Section 2">Section 2: Numerical</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="ques-fill">
                  <div className="writing-column">
                    <div className="flex">
                      <label>Enter Question</label>
                      <button
                        type="button"
                        className="ml-auto btn-no-bg mb-10"
                        onClick={() => setShowImageInput(true)}
                      >
                        <i className="fas fa-plus"></i> Add Image
                      </button>
                    </div>
                    <div className="ques-write">
                      <input
                        className="input-card input-size-full"
                        placeholder="Enter question text here"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                      />
                    </div>

                    {showImageInput && (
                      <div className="image-input-area">
                        <h3>Add Question Image</h3>

                        <div className="toggle-buttons">
                          <button
                            className={`toggle-button ${uploadMode === "device" ? "active" : ""
                              }`}
                            onClick={() => setUploadMode("device")}
                          >
                            Upload from Device
                          </button>
                          <button
                            className={`toggle-button ${uploadMode === "link" ? "active" : ""
                              }`}
                            onClick={() => setUploadMode("link")}
                          >
                            Upload from Link
                          </button>
                        </div>

                        {uploadMode === "device" && (
                          <div id="upload-device-section">
                            <input
                              type="file"
                              accept="image/*"
                              className="direct-file-input"
                              id="local-file-input"
                            />
                          </div>
                        )}

                        {uploadMode === "link" && (
                          <div className="link-input-group">
                            <input
                              type="url"
                              id="file-url-input"
                              className="link-input"
                              placeholder="Enter file URL (e.g., image.png)"
                            />
                            <button
                              id="upload-url-btn"
                              className="upload-link-button"
                            >
                              Upload Link
                            </button>
                          </div>
                        )}

                        {uploadedImageURL && (
                          <div className="image-preview-container">
                            <span className="image-preview-text">
                              Image Preview:
                            </span>
                            <img
                              src={uploadedImageURL}
                              alt="Preview"
                              className="image-preview-img"
                            />
                            <button
                              type="button"
                              className="remove-image-button"
                              onClick={() => {
                                setUploadedImageURL("");
                                fileInputRef.current.value = null;
                              }}
                            >
                              Remove Image
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="ques-fill">
                  <div className="writing-column">
                    {[option1, option2, option3, option4].map((opt, idx) => (
                      <>
                        <label>Option {idx + 1} : </label>
                        <input
                          key={idx}
                          type="text"
                          value={opt}
                          className="input-card mb-10 input-full-size"
                          onChange={(e) => {
                            const setters = [
                              setOption1,
                              setOption2,
                              setOption3,
                              setOption4,
                            ];
                            setters[idx](e.target.value);
                          }}
                          placeholder="write your option"
                          required
                        />
                      </>
                    ))}
                    <select
                      value={correctOption}
                      onChange={(e) => setCorrectOption(e.target.value)}
                      required
                    >
                      <option value="">Select Correct Option</option>
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          Option {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="form-btns">
                <button
                  type="button"
                  className="previous-btn"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    className="ml-auto next-btn"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                ) : (
                  <button type="submit" className="done-btn ml-auto">
                    Done
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddQuestionForm;
