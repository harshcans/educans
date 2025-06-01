import React, { useState, useEffect } from 'react';
import { firestore } from '../../firebase';
import { useNavigate } from 'react-router-dom';

function Timer() {
  const [totalTime, setTotalTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(() => {
    const storedRemainingTime = localStorage.getItem('remainingTime');
    return storedRemainingTime ? parseInt(storedRemainingTime) : null;
  });
//  const [timerRunning, setTimerRunning] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    // Fetch total time from Firestore
    const fetchTotalTime = async () => {
      try {
        const doc = await firestore.collection('remainingTime').doc('cGTY4nuiCrftl9isboGH').get();
        if (doc.exists) {
          const total = doc.data().totalTime* 60;
          setTotalTime(total);
          if (!remainingTime) {

            setRemainingTime(total);

          }
          const testCompletedStatus = localStorage.getItem('testCompleted');
          if (testCompletedStatus === 'true') {
            // history('/completed');
            setTestCompleted(true);
            setSubmitDisabled(true);
            setRemainingTime(0)
          }
        }
      } catch (error) {
        console.error('Error fetching total time:', error);
      }
    };

    fetchTotalTime();
  }, [remainingTime]);

  useEffect(() => {
    if (remainingTime === 0) {
      setSubmitDisabled(false);
    }
  }, [remainingTime]);
  useEffect(() => {
    let interval;

    if (remainingTime !== null && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          const updatedTime = prevTime - 1;
          if (updatedTime <= 0) {
            clearInterval(interval);
            setSubmitDisabled(false);
            setTestCompleted(true);
            localStorage.setItem('testCompleted', 'true'); // Mark test as completed in local storage
            return 0;
          }
          return updatedTime;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [ remainingTime]);

  useEffect(() => {
    // Update local storage whenever remainingTime changes
    localStorage.setItem('remainingTime', remainingTime);
  }, [remainingTime]);

 
  const handleSubmit = async () => {
    // const handleTestCompletion = async () => {
      try {
        await firestore.collection('completedTests').add({
          elapsedTime: totalTime - remainingTime,
          timestamp: new Date()
        });
        localStorage.setItem('testCompleted', 'true');
        setSubmitDisabled(true);
        setTestCompleted(true);
      } catch (error) {
        console.error('Error submitting test data:', error);
      }
    };
  

  if (totalTime === null) {
    return <p>Loading total time...</p>;
  }

  return (
    <div className="row-right question-analysis">
      <div className='flex right-top-header'>
      <p className="flex-1"> Time: {remainingTime} </p>
        <div button onClick={handleSubmit} disabled={submitDisabled} className="top-buttons pointer testname">Submit</div>
      {/* <p>Total Time: {totalTime} seconds</p> */}
      </div>
      {/* <button onClick={handleSubmit} disabled={submitDisabled}>Submit</button> */}
      {/* {testCompleted && <p>You have completed the test. You cannot take it again.</p>} */}
      <div className="sectionnames">
          <div className="name-section"><div>Section 1 ~ Total Question</div>
          <div className='circles-index'>
            <div className='circles'>2</div>
            <div className='circles'>2</div>
            <div className='circles'>28</div>
            <div className='circles'>2</div>
            <div className='circles'>2</div>
            <div className='circles'>2</div>
            <div className='circles'>23</div>
            <div className='circles'>2</div>
            <div className='circles'>23</div>
            <div className='circles'>2</div>
            <div className='circles'>26</div>
            <div className='circles'>2t</div>
            <div className='circles'>25</div>
            <div className='circles'>2</div>
            <div className='circles'>2</div>
            <div className='circles'>2</div>
            <div className='circles'>2</div>
            <div className='circles'>32</div>
            <div className='circles'>2</div>
            <div className='circles'>25</div>
            <div className='circles'>32</div>
            <div className='circles'>2</div>
            <div className='circles'>2</div>
          </div>
          </div>
          <div className="name-section"><div>Section 2 ~ Total Question</div></div>
      </div>
    </div>
  );
}

export default Timer;
