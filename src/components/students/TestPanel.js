import React, { useState, useEffect, useRef } from "react";
import "./Testview.css";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../../firebase";
import { supabase } from "../../supabase";

const TestPanel = ({ emailid }) => {
  const { testID } = useParams();
  const history = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updateUI, setUpdateUI] = useState(false);
  const [testData, setTestData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeOption, setActiveOption] = useState(null);
  // const [remainingTime, setRemainingTime] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [questionsPerSubject, setQuestionsPerSubject] = useState(0); // To store perSubjectQues
  const [selectedSubjectName, setSelectedSubjectName] = useState(""); // Stores the name (e.g., 
  const [allQuestions, setAllQuestions] = useState([]);
  const timerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);

        const testDoc = await firestore.collection("tests").doc(testID).get();
        if (testDoc.exists) {
          const data = testDoc.data();
          setTestData(data);

          const examSnap = await firestore.collection("exams").doc("JEE Mains").get();
          if (examSnap.exists) {
            const totalTime = examSnap.data().totalTime || 180;
            const perQues = examSnap.data().perSubjectQues || 0;
            const subjectNamesArray = examSnap.data().subjectNames || [];

            setTimeLeft(totalTime * 60);
            setQuestionsPerSubject(perQues);
            setAvailableSubjects(subjectNamesArray);

            // Set default subject on load
            if (!selectedSubjectName && subjectNamesArray.length > 0) {
              setSelectedSubjectName(subjectNamesArray[0]);
            }

            // ✅ Fetch all questions once
            const questionsSnap = await firestore
              .collection("tests")
              .doc(testID)
              .collection("questions")
              .get();

            const allFetched = questionsSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setAllQuestions(allFetched); // 🔁 Store all
          }
        }
      } catch (error) {
        console.error("Error fetching test data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testID]);

  useEffect(() => {
    if (selectedSubjectName && allQuestions.length > 0) {
      const filtered = allQuestions.filter(
        (q) => q.subject === selectedSubjectName
      );
      setQuestions(filtered);

      // Only reset to 0 if index was not manually set
      // if (filtered.length > 0 && currentQuestionIndex >= filtered.length) {
        setCurrentQuestionIndex(0);
      // }
    }
  }, [selectedSubjectName, allQuestions]);




  useEffect(() => {
    const loadSelectedOption = () => {
      const storageKey = `${emailid}_${testID}_answers`;
      const storedAnswers = JSON.parse(localStorage.getItem(storageKey)) || {};
      const currentQuestion = questions[currentQuestionIndex];
      const questionId = currentQuestion?.id;

      if (storedAnswers[questionId]) {
        setSelectedItem(storedAnswers[questionId].optionValue);
        setActiveOption(storedAnswers[questionId].selectedOption);
      } else {
        setSelectedItem(null);
        setActiveOption(null);
      }
    };

    loadSelectedOption();
  }, [currentQuestionIndex, emailid, testID]);

  const handleOptionSelect = (optionText, optionIndex) => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionId = currentQuestion?.id;
    const option = optionIndex + 1;

    // Save selection to localStorage
    const storageKey = `${emailid}_${testID}_answers`;
    const storedAnswers = JSON.parse(localStorage.getItem(storageKey)) || {};

    storedAnswers[questionId] = {
      selectedOption: option,
      optionValue: optionText,
    };

    localStorage.setItem(storageKey, JSON.stringify(storedAnswers));
    setSelectedItem(optionText);
    setActiveOption(option);
  };

  const handleNextQuestion = () => {
    // Case 1: Move to next question within current subject
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Case 2: Move to next subject if exists
      const currentSubjectIndex = availableSubjects.indexOf(selectedSubjectName);
      const nextSubjectIndex = currentSubjectIndex + 1;

      if (nextSubjectIndex < availableSubjects.length) {
        const nextSubject = availableSubjects[nextSubjectIndex];
        setSelectedSubjectName(nextSubject);
      } else {
        alert("You’ve completed all subjects!");
      }
    }
  };
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Case 1: Go to previous question in current subject
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      // Case 2: We're at the first question, go to previous subject if it exists
      const currentSubjectIndex = availableSubjects.indexOf(selectedSubjectName);
      const prevSubjectIndex = currentSubjectIndex - 1;

      if (prevSubjectIndex >= 0) {
        const prevSubject = availableSubjects[prevSubjectIndex];
        setSelectedSubjectName(prevSubject);

        // ⚠️ Delay needed because filtering is async in useEffect
        setTimeout(() => {
          // Set to last question of new subject (after it's filtered)
          const prevSubjectQuestions = allQuestions.filter(
            (q) => q.subject === prevSubject
          );

          setQuestions(prevSubjectQuestions);
          setCurrentQuestionIndex(prevSubjectQuestions.length - 1);
        }, 100); // Delay ensures `setSelectedSubjectName` triggers filtering first
      } else {
        console.log("🛑 Already at the beginning of the first subject");
      }
    }
  };


  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

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
      localStorage.clear();


      alert("Test submitted successfully!");
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Failed to submit answers. Please try again.");
    } finally {
      history(`/result/${testID}`);
    }
  };

  const handleMarkForReview = () => {
    const reviewKey = `${emailid}_${testID}_review_${currentQuestionIndex + 1}`;
    localStorage.setItem(reviewKey, "marked");
    setUpdateUI((prev) => !prev); // re-render to reflect updated class
  };

  const handleClearResponse = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionId = currentQuestion?.id;
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")} : ${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (timeLeft === null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const handleAutoSubmit = () => {
    alert("Time's up! Auto-submitting...");
    handleSubmit();
  };

  useEffect(() => {
    const handleUnload = (e) => {
      handleSubmit(true); // Silent auto-submit
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [timeLeft]);

  const handleSubjectChange = (e) => {
    const selectedSubject = e.target.value;
    setSelectedSubjectName(selectedSubject);
    // const selectedIndex = availableSubjects.findIndex(
    //   (subject) => subject === selectedSubject
    // );
    // const newIndex = selectedIndex * questionsPerSubject + 1;
    // setCurrentQuestionIndex(newIndex);
    // console.log('new',newIndex)
  };

  // const forceUpdate = () => setRenderUpdate(prev => !prev);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
          width: "100vw",
          flexDirection: "column",
        }}
      >
        <div className="loader"></div>
        <p>Your Test is Loading...</p>
        <p>Please Wait</p>
      </div>
    );
  }

  return (
    <>
        <div className="top-wrapper flex">
          <div className="flex">
            <div className="logo flex" style={{ marginLeft: "37.5px" }}>
              <div className="logo-first-word">Grade</div>
              <div className="logo-second-word">Flow</div>
            </div>
            <div className="upper-head row-center w-100">
              <div className="testname">{testData && testData.Name}</div>
              <div className="testformat">{testData && testData.Format}</div>
            </div>
          </div>
{timeLeft !== null && (
            <p className="top-buttons ml-auto">{formatTime(timeLeft)} </p>
          )}
          <div className=" btn5" onClick={handleSubmit}>Submit</div>
        </div>
      <div className="container flex">
        <div className="flex0-1 flex-column">
          <div className="container flex-nc">
            <div className="main-wrapper2">
              <div className="more-info">
                <div className="time-left flex"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#3730a3" fill="none">
                  <path d="M16 12H12L12 6" stroke="#3730a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2" stroke="#3730a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M18.8475 4.17041C19.0217 4.3242 19.1911 4.48354 19.3555 4.648C19.5199 4.81246 19.6791 4.98203 19.8328 5.15629M15 2C15.4821 2.14255 15.9548 2.32634 16.4134 2.54664M21.4375 7.55457C21.6647 8.02313 21.8539 8.50663 22 9" stroke="#3730a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg> 57: 12 </div>
                <div className="ml-auto">
                  <i
                    className="fa-solid fa-border-all"
                    ref={buttonRef}
                    onClick={() => setShowPopup(!showPopup)}
                    style={{ position: "relative", zIndex: 1 }}
                  ></i>
                  {showPopup && (
                    <div
                      style={{
                        position: "absolute",
                        top:
                          buttonRef.current?.offsetTop +
                          buttonRef.current?.offsetHeight +
                          5,

                        left:
                          buttonRef.current?.offsetLeft +
                          buttonRef.current?.offsetWidth / 2 -
                          260, // assuming popup width ≈ 200px to center it

                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        padding: "15px",
                        marginRight: "10px",
                        borderRadius: "5px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        zIndex: 2,
                      }}
                    >
                      <h3>Questions Status</h3>
                      <div className="point-container">
                        <div className="flex">
                          <div className="point green"></div>
                          <p className="mr-10">Answered</p>
                        </div>
                        <div className="flex">
                          <div className="point red"></div>
                          <p>Unanswered</p>
                        </div>
                        <div className="flex mr-10">
                          <div className="point violet"></div>
                          <p>Marked for Review</p>
                        </div>
                        <div className="flex">
                          <div className="point grey"></div>
                          <p>Not Visited</p>
                        </div>
                      </div>
                      <h4>Section 1 :</h4>
                      <div className="circles-index">
                        {questions.map((question, index) => {
                          const answers = JSON.parse(
                            localStorage.getItem(
                              `${emailid}_${testID}_answers`
                            ) || "{}"
                          );
                          const questionId = question.id;
                          const isAnswered = answers.hasOwnProperty(questionId);

                          const reviewKey = `${emailid}_${testID}_review_${index + 1
                            }`;
                          const isMarked = localStorage.getItem(reviewKey);

                          let circleClass = "circles";
                          if (isMarked) {
                            circleClass += " violet"; // marked for review
                          } else if (isAnswered) {
                            circleClass += " green"; // answered
                          } else {
                            circleClass += " red"; // unanswered
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
                  )}
                </div>
              </div>
              <div className="questions-section">
                {questions.length > 0 && (
                  <div>
                    <div className="flex-sb">
                      <div className="question-number">
                        Question: {currentQuestionIndex + 1}
                      </div>

                      <div className="chosing-format hidden">
                        Only One Correct Answer
                      </div>
                      {availableSubjects.length > 0 && (
                        <select
                          className="select3"
                          onChange={handleSubjectChange}
                          value={selectedSubjectName}
                        >
                          {availableSubjects.map((subjectName, index) => (
                            <option key={index} value={subjectName}>
                              {subjectName}
                            </option>
                          ))}
                        </select>
                      )}

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
                              onClick={() => handleOptionSelect(option, index)}
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
          <div className="buttons-check">
            <div className="button yellow" onClick={handleMarkForReview}>
              Mark for Review
            </div>
            <div className="button red" onClick={handleClearResponse}>
              Clear Response
            </div>
            <div className="button indigo" style={{ marginLeft: "auto" }} onClick={handlePreviousQuestion}>
              <p>Previous Ques</p>
              <i className="fa-solid fa-angle-left"></i>
            </div>
            <div className="button indigo" onClick={handleNextQuestion}>
              <p>Save and Next</p>
              <i className="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </div>
      <div className="row-right question-analysis">
       
        <div className="sectionnames">
          <div className="name-section">
            <span>Section 1 ~ Total Question</span>
            <div className="circles-index">
              {questions.map((ques, index) => {
                const answers = JSON.parse(
                  localStorage.getItem(`${emailid}_${testID}_answers`) || "{}"
                );
                const questionId = ques.id;
                const isAnswered = answers.hasOwnProperty(questionId);

                const reviewKey = `${emailid}_${testID}_review_${index + 1}`;
                const isMarked = localStorage.getItem(reviewKey);

                // New: Check if the question has been seen
                const seenKey = `${emailid}_${testID}_seen_${index + 1}`;
                const hasBeenSeen = localStorage.getItem(seenKey);

                let circleClass = "circles";

                // Priority for active question
                if (index === currentQuestionIndex) {
                  circleClass += " indigo"; // Currently active question
                } else if (isMarked) {
                  circleClass += " yellow"; // Marked for review
                } else if (isAnswered) {
                  circleClass += " green"; // Answered
                } else if (hasBeenSeen) {
                  circleClass += " red"; // Seen but not answered
                }
                return (
                  <div
                    key={index}
                    className={circleClass}
                    onClick={() => {
                      // When a question is clicked, mark it as seen
                      localStorage.setItem(seenKey, "true");
                      setCurrentQuestionIndex(index);
                    }}
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
      </div>
    </>
  );
};

export default TestPanel;
