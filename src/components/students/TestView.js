import React, { useState, useEffect } from 'react';
import "./Testview.css";
import { useParams, useNavigate } from 'react-router-dom';
import { firestore, auth } from '../../firebase';
import Timer from './tests';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Login from '../Login';
import TestPanel from './TestPanel';

const TestView = () => {
  const { testID } = useParams();
  const history = useNavigate();
  const [testData, setTestData] = useState(null);
  const [style, setStyle] = useState('hidden');
  const [style2, setStyle2] = useState('TestView w-100');
  const [notloggedin, setNotloggedin] = useState(false);
  const [activeOption, setActiveOption] = useState(null);
  // const [remainingTime, setRemainingTime] = useState(0);
  const [selectedOption, setSelectedOption] = useState(false);
  const [user, setUser] = useState(null);




  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const { email } = user;
        setNotloggedin(false);
        setUser(email)
      } else {
        setNotloggedin(true);
        // If not authenticated, set teacher state to null
      }
    });

    return () => unsubscribe(); 
  }, []);



  const handleStartExam = () => {
     if (!selectedOption) {
      // If option is not selected, display an alert
      alert('Please select the option before starting the exam.');
    } else {
     setStyle('hidden');
     setStyle2("TestView width-100");
    }
  };

  return (
    <>
    <div className={style}>
      
      <div className='flex-column'>
        <div className="top-wrapper2">
          <div className="row-center">
            <div className="testname">Instruction for online Exam</div>
            {/* <div>for {testData && testData.Test_Name}</div> */}
          </div>
        </div>
        <div className='main-wrapper test-instruction'>
          <h3>Please read the instructions carefully before starting the examination</h3>
          <p>1. Click on Start Exam bocum of your screen to begin examination.</p>
          <p>2. The clock has been set at server and count down tomer at the top right side of the screen will display left out time so closure from where you can monitor time you have to complete the exam</p>
          <p>3. Click on Next Button for next question</p>
          <p>4. The colour coded diagram on the right side of the screen shows the status of question</p>
          <div className='flex'><button className="red">Red</button><p>Not Answered Question</p></div>
          <div className='flex'><button className="green">Green</button><p>Answered Question</p></div>
          <div className='flex'><button className="grey">Grey</button><p>Unanswered Question</p></div>
          <p>5: All the answered questions will be counted for calculating the firial score</p>
          <p>8. Do not dick End Exam Button before completing the examination. In case you click End Exam burzon you will not be permined to continue</p>
        </div>
        <div className='bottom'>
          <div className='flex'>
            <input type='radio' onChange={() => setSelectedOption(true)} />
            <label><b>I have read and understood the instructions given above</b></label>
          </div>
         <Popup trigger={<></>} modal nested open={notloggedin}>
            {
              close => (
                <div>
                  <p className='flex-center'>Please Log In to Attempt Test</p>
                  <Login testpanellink={testID} />
                </div>
              )
            }
          </Popup>
          <button onClick={handleStartExam}>Start the Exam</button>
        </div>
      </div>
      </div>
    <div className={style2}>
      <TestPanel emailid={user} />
    </div>
    </>
  );
}

export default TestView;