import React, { useState, useEffect } from "react";
import "./Testview.css";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../../firebase";
import Timer from "./tests";
import { supabase } from "../../supabase";

const TestPanel = ({ emailid }) => {
  const { testID } = useParams();
  const history = useNavigate();
  const [updateUI, setUpdateUI] = useState(false);
  const [testData, setTestData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeOption, setActiveOption] = useState(null);
  // const [remainingTime, setRemainingTime] = useState(0);
  const [renderUpdate, setRenderUpdate] = useState(false);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const testDoc = await firestore.collection("tests").doc(testID).get();
        if (testDoc.exists) {
          const data = testDoc.data();
          setTestData(data);

          const questionsRef = await firestore
            .collection("tests")
            .doc(testID)
            .collection("questions")
            .get();
          const questionsData = questionsRef.docs.map((doc) => doc.data());
          setQuestions(questionsData);
        } else {
          console.log("Test not found");
        }
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    };

    const loadSelectedOption = () => {
      const storageKey = `${emailid}_${testID}_answers`;
      const storedAnswers = JSON.parse(localStorage.getItem(storageKey)) || {};
      const questionId = `question${currentQuestionIndex + 1}`;

      if (storedAnswers[questionId]) {
        setSelectedItem(storedAnswers[questionId].optionValue);
        setActiveOption(storedAnswers[questionId].selectedOption);
      } else {
        setSelectedItem(null);
        setActiveOption(null);
      }
    };

    fetchTestData();
    loadSelectedOption();
  }, [testID, currentQuestionIndex, emailid]);

  const handleOptionSelect = (optionText, optionIndex) => {
    const questionId = `question${currentQuestionIndex + 1}`;
    const option = optionIndex + 1;

    // Save selection to localStorage
    const storageKey = `${emailid}_${testID}_answers`;
    const storedAnswers = JSON.parse(localStorage.getItem(storageKey)) || {};

    storedAnswers[questionId] = {
      selectedOption: option,
      optionValue: optionText,
    };

    localStorage.setItem(storageKey, JSON.stringify(storedAnswers));

    // Update UI
    setSelectedItem(optionText);
    setActiveOption(option);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      console.log("No more questions");
    }
  };

  const handlePreviousQuestion = async () => {
    if (currentQuestionIndex > 0) {
      const prevQuestionIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevQuestionIndex);
    } else {
      console.log("Already at the first question");
    }
  };

  const handleSubmit = async () => {
    const storageKey = `${emailid}_${testID}_answers`;
    const storedAnswers = JSON.parse(localStorage.getItem(storageKey)) || {};

    const batch = firestore.batch();

    for (const [questionId, answerData] of Object.entries(storedAnswers)) {
      const docRef = firestore
        .collection("userAnswers")
        .doc(emailid)
        .collection(testID)
        .doc(questionId); // questionId is like "question1", "question2", etc.

      batch.set(docRef, answerData);
    }

    try {
      await batch.commit();
      console.log("Submitted successfully");
      history(`/result/${testID}`);
      // ✅ Clear answer data
      localStorage.removeItem(storageKey);

      // ✅ Clear all review flags
      const totalQuestions = questions.length;
      for (let i = 1; i <= totalQuestions; i++) {
        const reviewKey = `${emailid}_${testID}_review_${i}`;
        localStorage.removeItem(reviewKey);
      }

      // ✅ Optional: Redirect or update UI
      // history("/test-complete");
      alert("Test submitted successfully!");
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Failed to submit answers. Please try again.");
    }
  };

  const handleMarkForReview = () => {
    const reviewKey = `${emailid}_${testID}_review_${currentQuestionIndex + 1}`;
    localStorage.setItem(reviewKey, "marked");
    setUpdateUI((prev) => !prev); // re-render to reflect updated class
  };

  const handleClearResponse = () => {
    const questionId = `question${currentQuestionIndex + 1}`;
    const storageKey = `${emailid}_${testID}_answers`;
    const reviewKey = `${emailid}_${testID}_review_${currentQuestionIndex + 1}`;

    const storedAnswers = JSON.parse(localStorage.getItem(storageKey)) || {};

    // Remove this question's answer from stored answers
    delete storedAnswers[questionId];

    // Save updated answers back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(storedAnswers));

    // Remove review mark
    localStorage.removeItem(reviewKey);

    // Clear UI state
    setSelectedItem(null);
    setActiveOption(null);
    setUpdateUI((prev) => !prev); // force re-render
  };

  // const forceUpdate = () => setRenderUpdate(prev => !prev);

  return (
    <>
      <div className="container2 flex-column">
        <div className="top-wrapper">
          <div className="upper-head flex">
            
            <div className="row-center">
              <div className="testname">{testData && testData.Test_Name}</div>
              <div className="testformat">
                {testData && testData.Test_Format}
              </div>
            </div>
          </div>
        </div>
        <div className="flex0-1 flex-column">
          <div className="container flex-nc">
            <div className="section-heasd">
              <div className="main-wrapper2">
                <div className="questions-section">
                  {questions.length > 0 && (
                    <div>
                      <div className="flex-sb">
                        <div className="question-number">
                          Question: {currentQuestionIndex + 1}
                        </div>

                        <div className="chosing-format">
                          Only One Correct Answer
                        </div>
                        <select className="select3">
                          <option>Physics</option>
                          <option>Chemistry</option>
                          <option>Mathematics</option>
                        </select>
                      </div>

                      <div className="question">
                        {questions[currentQuestionIndex].question}
                      </div>
                      <div className="flex-column">
                        {questions[currentQuestionIndex]?.options.map(
                          (option, index) => {
                            // const isImage = option.match(/\.(png|jpg|jpeg|webp)$/i);
                            const cleanOption = option?.trim();
                            const isImage = /\.(png|jpe?g|webp)$/i.test(
                              cleanOption
                            );

                            let imageUrl = null;

                            if (isImage) {
                              console.log(`Image option found: ${cleanOption}`);
                              const { data } = supabase.storage
                                .from("images")
                                .getPublicUrl(cleanOption);
                              imageUrl = data?.publicUrl;
                            }

                            return (
                              <button
                                key={index}
                                className={
                                  activeOption === index + 1
                                    ? "box-chosen"
                                    : "box"
                                }
                                onClick={() =>
                                  handleOptionSelect(option, index)
                                }
                              >
                                <input
                                  type="radio"
                                  name="radioGroup"
                                  value={option}
                                  checked={selectedItem === option}
                                  readOnly
                                />
                                <span className="yearly">
                                  {isImage ? (
                                    <img
                                      src={imageUrl}
                                      alt={`option ${index + 1}`}
                                      style={{
                                        maxHeight: "80px",
                                        objectFit: "contain",
                                      }}
                                    />
                                  ) : (
                                    <> &nbsp; {option} </>
                                  )}
                                </span>
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="buttons-check">
            <div className="button btn3" onClick={handlePreviousQuestion}>
              <p>Previous Ques</p>
              <i className="fa-solid fa-angle-left"></i>
            </div>
            <div className="button btn2" onClick={handleClearResponse}>
              Clear Response
            </div>
            <div className="button btn1" onClick={handleMarkForReview}>
              Mark for Review
            </div>
            <div className="button btn4" onClick={handleNextQuestion}>
              <p>Save and Next</p>
              <i className="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="row-right question-analysis">
        <div className="flex right-top-header">
          <p className="flex-1"> Time: </p>
          <div onClick={handleSubmit} className="top-buttons pointer testname">
            Submit
          </div>
          {/* <p>Total Time: {totalTime} seconds</p> */}
        </div>
        {/* <button onClick={handleSubmit} disabled={submitDisabled}>Submit</button> */}
        {/* {testCompleted && <p>You have completed the test. You cannot take it again.</p>} */}
        <div className="sectionnames">
          <div className="name-section">
            <span>Section 1 ~ Total Question</span>
            <div className="circles-index">
              {questions.map((_, index) => {
                const answers = JSON.parse(
                  localStorage.getItem(`${emailid}_${testID}_answers`) || "{}"
                );
                const questionId = `question${index + 1}`;
                const isAnswered = answers.hasOwnProperty(questionId);

                const reviewKey = `${emailid}_${testID}_review_${index + 1}`;
                const isMarked = localStorage.getItem(reviewKey);

                let circleClass = "circles";
                if (isMarked) {
                  circleClass += " green"; // marked for review
                } else if (isAnswered) {
                  circleClass += " red"; // answered
                } else {
                  circleClass += " violet"; // unanswered
                }

                return (
                  <div
                    key={index}
                    className={circleClass}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="name-section">
            <div>Section 2 ~ Total Question</div>
          </div>
        </div>
      </div>
      {/* <div>Remaining Time: {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60}</div> */}
    </>
  );
};

export default TestPanel;
