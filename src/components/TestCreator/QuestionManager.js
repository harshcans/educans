import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import "../CSS/CreateQuestionForm.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const QuestionManager = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const { testID } = useParams();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const QuesRef = firestore
          .collection("tests")
          .doc(testID)
          .collection("questions");
        const snapshot = await QuesRef.get();
        const fetchedQuestions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [testID]);

  const deleteQuestion = async (qid) => {
    await firestore
      .collection("tests")
      .doc(testID)
      .collection("questions")
      .doc(qid)
      .delete();
    setQuestions((prev) => prev.filter((q) => q.id !== qid));
  };

  const PopupOpen = (questionData) => {
    setModalOpen(true);
    setSelectedQuestion(questionData);
  };

  const addQuestion = () => {
    navigate(`/author/creation/${testID}/add-question`);
  };

  return (
    <div className="flex testqueestionlist">
      <Sidebar active="button2" />

      <div className="main questions-view" style={{ background: "white" }}>
        <div className="header flex">
          <div className="row-right">
            <Popup
              trigger={<i className="fa-solid fa-bars" />}
              position="bottom left"
              closeOnDocumentClick
              mouseLeaveDelay={300}
              mouseEnterDelay={0}
              contentStyle={{ padding: "0px", border: "none" }}
              arrow={false}
            >
              <Sidebar />
            </Popup>
            <h2>Exam Paper Creation</h2>
          </div>
          <div className="row-left">
            <i className="fa-regular fa-bell" />
            <i className="fa-solid fa-gear" />
            <i className="fa-regular fa-circle-user" />
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div className="main-wrapper">
            <nav style={{ display: "flex" }}>
              <h3>Questions :</h3>
              {modalOpen && selectedQuestion && (
                <div className="modal">
                  {!deleteOpen ? (
                    <div className="modal-content">
                      <h2 className="modal-header text-center">See Your Ques</h2>
                      <div className="question"><b>Ques :  &nbsp; </b> {selectedQuestion.question}</div>
                      {selectedQuestion.options.map((option, i) => (
                        <div key={i} className={selectedQuestion.correctOption + 1 === i ? "box-chosen" : "box"}>
                          <input
                            type="radio"
                            name="radioGroup"
                            value={option}
                          checked={selectedQuestion.correctOption + 1 === i}
                          />
                          <span className="yearly ">
                            &nbsp; {option}
                          </span>
                        </div>
                      ))}
                      <button onClick={() => setModalOpen(false)}>Close</button>
                    </div>
                  ) : (
                    <div className="modal-content">
                      <p>Please Confirm While Deleting Ques</p>
                      <p className="question"> {selectedQuestion.question}</p>
                      <button onClick={() => { setModalOpen(false); setDeleteOpen(false); }}>Close</button>
                      <button onClick={() => deleteQuestion(selectedQuestion.id)}>Delete</button>
                    </div>)
                  }
                </div>

              )}

              <button onClick={addQuestion} className="ml-auto">
                Add Question <i className="fa fa-plus" />
              </button>
              <select className="select3 ">
                <option>Subject</option>
              </select>
            </nav>
            {!loading ? (
              <div className="question-container">
                {questions.map((q, idx) => (
                  <div className="ques-row">
                    <div
                      className="flex"
                      style={{
                        padding: "0 8px",
                        maxWidth: "605px",
                        gap: "20px",
                      }}
                    >
                      <p className="index">{idx + 1}.</p>

                      <p className="subject-index">{q.subject}</p>
                      <p className="question-name">{q.question}</p>
                    </div>
                    <div className="ml-auto flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        color="#141B34"
                        fill="none"
                        onClick={() => navigate("/author/creation/" + testID + "/add-question?edit=" + q.question + "&qid=" + q.id + "&subject=" + q.subject + "&options=" + JSON.stringify(q.options) + "&correctOption=" + q.correctOption + "&section=" + q.section)}
                        style={{ cursor: "pointer" }}
                      >
                        <path
                          d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506"
                          stroke="#141B34"
                          stroke-width="1.5"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5"
                          stroke="#141B34"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        color="#141B34"
                        fill="none"
                        onClick={() => PopupOpen(q)}
                        style={{ cursor: "pointer" }}
                      >
                        <path
                          d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z"
                          stroke="#141B34"
                          stroke-width="1.5"
                        ></path>
                        <path
                          d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z"
                          stroke="#141B34"
                          stroke-width="1.5"
                        ></path>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        color="#000000"
                        fill="none"
                        onClick={() => { PopupOpen(q); setDeleteOpen(true); }}
                        style={{ cursor: "pointer" }}
                      >
                        <path
                          d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        ></path>
                        <path
                          d="M9 11.7349H15"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        ></path>
                        <path
                          d="M10.5 15.6543H13.5"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        ></path>
                        <path
                          d="M3 5.5H21M16.0555 5.5L15.3729 4.09173C14.9194 3.15626 14.6926 2.68852 14.3015 2.39681C14.2148 2.3321 14.1229 2.27454 14.0268 2.2247C13.5937 2 13.0739 2 12.0343 2C10.9686 2 10.4358 2 9.99549 2.23412C9.89791 2.28601 9.80479 2.3459 9.7171 2.41317C9.32145 2.7167 9.10044 3.20155 8.65842 4.17126L8.05273 5.5"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        ></path>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="skeleton-ques-row">
                <div className="skeleton-content-left">
                  <div className="skeleton-index"></div>
                  <div className="skeleton-subject-index"></div>
                  <div className="skeleton-question-name"></div>
                </div>
                <div className="skeleton-actions-right">
                  <div className="skeleton-icon"></div>
                  <div className="skeleton-icon"></div>
                  <div className="skeleton-icon"></div>
                </div>
              </div>
            )}
          </div>
          <div className="test-info">
            <h3>Test Information</h3>
            <div className="test-name">
              <p>Test Name:</p>
              <p className="edit-disable">Sample</p>
            </div>
            <div className="test-card">
              <p><b>Total Questions : </b> 75</p>
              <div className="flex ">
                <p className="subject-index">25</p>
                &nbsp;<p>&nbsp;Maths</p>
              </div>
              <div className="flex ">
                <p className="subject-index">25</p>
                &nbsp;<p>&nbsp;Chemistry</p>
              </div>
              <div className="flex ">
                <p className="subject-index">25 </p>
                &nbsp;<p>&nbsp;Physics</p>
              </div>
            </div>
            <div className="test-card">
              <p>Responses</p>
              <div className="flex ">
                <p className="subject-index">5</p>
                <p>Students</p>
              </div>
            </div>
            <div className="edit-info">
              <p>Last Edited On :</p>
              <p className="edit-disable">7 Oct 2025 at 4:00pm</p>
            </div>
            <div className="action-btn flex">
              <i className="fa-regular fa-share-from-square"></i>
              <div>Share the Exam !!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionManager;
