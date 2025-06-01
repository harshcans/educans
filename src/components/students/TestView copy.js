import React, { useState, useEffect } from 'react';
import "./Testview.css";
import { useParams,useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';

const TestPanel = () => {
  const { testId } = useParams();
  const history = useNavigate();
  const [testData, setTestData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  // const [remainingTime, setRemainingTime] = useState(0);
  const userId="userId"

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        // Fetch test document by ID
        const testDoc = await firestore.collection('tests').doc(testId).get();
      
        if (testDoc.exists) {
          const data = testDoc.data();
          setTestData(data);
          // Fetch questions for the specific test
          const questionsRef = await firestore.collection('tests').doc(testId).collection('questions').get();
          const questionsData = questionsRef.docs.map(doc => doc.data());
          setQuestions(questionsData);
        } else {
          console.log('Test not found');
        }
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };

    const fetchOption = async (optionText, optionIndex) => {
      const questionId = `question${currentQuestionIndex + 1}`;
      console.log(questionId, testId);
    const option = optionIndex + 1;
      // Construct userAnswerRef with the correct document ID
      const userAnswerRef = firestore.collection('userAnswers').doc('userId').collection(testId).doc(questionId);
    
      try {
        const doc = await userAnswerRef.get();
        if (doc.exists) {
          const timeData = doc.data();
        setSelectedItem(timeData.optionValue);
        } else {
          const timeData = doc.data();
          console.log('User answer not found');
        setSelectedItem(timeData.optionValue);
      }
      } catch (error) {
        console.error('Error fetching user answer:', error);
      }
    }
    

    fetchTestData();
    fetchOption();
  }, [testId,currentQuestionIndex]);


  const handleOptionSelect = async (optionText, optionIndex) => {
    const questionId = `question${currentQuestionIndex + 1}`;
  const option = optionIndex + 1;
    setSelectedItem(optionText);
    const userAnswerRef = firestore.collection('userAnswers').doc('userId').collection(testId).doc(questionId);
  
    try {
      const doc = await userAnswerRef.get();
      if (doc.exists) {
      await userAnswerRef.update({ selectedOption: option , 'optionValue': optionText });
      } else {
      await userAnswerRef.set({ selectedOption: option , 'optionValue':optionText });
    }
    } catch (error) {
      console.error('Error fetching user answer:', error);
    }
  }

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      console.log('No more questions');
    }
  };
  
  const handlePreviousQuestion = async () => {
    if (currentQuestionIndex > 0) {
      const prevQuestionIndex = currentQuestionIndex - 1 ;
          setCurrentQuestionIndex(prevQuestionIndex);
    } else {
      console.log('Already at the first question');
    }
  };
  
  
  


  return (
    <div className="TestView width-100">
      <div className="container2">
        <div className="top-wrapper">
          <div className="upper-head flex">
            <div className="row-center">
              <div className="testname">{testData && testData.Test_Name}</div>
              <div className="testformat">{testData && testData.Test_Format}</div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex-column">
          <div className="container flex">
            <div className="section-head">
              TOPICS
              <button className="button-topics">Chemistry</button>
              <button className="button-topics">Physics</button>
              <button className="button-topics">Maths</button>
            </div>
            <div className="main-wrapper2">
              <div className="questions-section">
                {questions.length > 0 && (
                  <div>
                    <div className='question-number'>Question: {currentQuestionIndex + 1}</div>
                    <div className='question'>{questions[currentQuestionIndex].question}</div>
                    <div className="chosing-format">Only One Correct Answer</div>
                    <ul>
                    {questions[currentQuestionIndex].options.map((option, index) => (

    
<label htmlFor={index} className="box">
<div className="plan">
<input
    type="radio"
    name="radioGroup"
    value={option}
    checked={selectedItem === option} // Check if option1 is selected
    onChange={() => handleOptionSelect(option, index)}
  />
  <span className="yearly">{option}</span>
</div>
</label>

))}

                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="column-bottom">
            <div className="buttons-check">
              <div className="button btn3" onClick={handlePreviousQuestion}>Previous Ques</div>
              <div className="button btn2">Clear Response</div>
              <div className="button btn1">Mark for Review</div>
              <div className="button btn4" onClick={handleNextQuestion}>Save and Next</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row-right question-analysis">
        <div className="top-buttons testname">Submit</div>
        {/* <div>Remaining Time: {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60}</div> */}
        <div className="sectionnames">
          <div className="name-section">Section 1 ~ Total Question</div>
          <div className="name-section">Section 2 ~ Total Question</div>
        </div>
      </div>
    </div>
  );
}

export default TestPanel;
