import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import "../CSS/CreateQuestionForm.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const TestQuestionForm = ({}) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const { testID } = useParams();

  useEffect(() => {
    const fetchQuestions = async () => {
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

  const addQuestion = () => {
    navigate(`/author/creation/${testID}/add-question`);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="main questions-view">
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
        <div className="flex">
          <div className="main-wrapper">
            <nav className="flex">
              <h3>Questions :</h3> 
              <button onClick={addQuestion} className="ml-auto">
                Add Question <i className="fa fa-plus" />
              </button>
              <select className="select3 ">
                <option>Subject</option>
              </select>
            </nav>
           <div className="question-container">
                {questions.map((q, idx) => (

            <div className="ques-row">
              <p className="index">{idx + 1}.</p>
              <p className="subject-index">{q.subject}</p>
              <p className="question-name">{q.question}</p>
              <div className="ml-auto">
 <i                        className="fa fa-trash"
                      />
              </div>
            </div>
                ))}

           </div>
          </div>
          <div className="test-info">
            <h3>Test Information</h3>
            <div className="test-name">
              <p>Test Name:</p>
              <p className="edit-disable">Sample</p>
            </div>
            <div className="test-card">
              <p>Total Questions : 75</p>
              <div className="flex ">
              <p className="subject-index">75</p>
                <p>Maths</p>
              </div>
              <div className="flex ">
              <p className="subject-index">75</p>
                <p>Chemistry</p>
              </div>
              <div className="flex ">
              <p className="subject-index">75</p>
                <p>Physics</p>
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
            <i class="fa-regular fa-share-from-square"></i>
            <div>Share the Exam !!</div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestQuestionForm;
