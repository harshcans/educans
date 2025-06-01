import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import '../CSS/course.css';

const CourseAddTest = ({className}) => {
  const [testsList, setUsersList] = useState([]);
  const { courseId } = useParams();
  const [testId2, setTestId2] = useState('');
  const [disabledTests, setDisabledTests] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const testsRef = firestore.collection('teachers').doc('harshcans@gmail.com').collection('tests');
        const querySnapshot = await testsRef.get();
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsersList(usersData);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    const checkTestsAddedToCourse = async () => {
      try {
        const courseTestsRef = firestore.collection('courses').doc(courseId).collection('tests');
        const snapshot = await courseTestsRef.get();
        const testIds = snapshot.docs.map(doc => doc.id);
        setDisabledTests(testIds);
      } catch (error) {
        console.error('Error checking if test is already added to course:', error);
      }
    };

    fetchQuestions();
    checkTestsAddedToCourse();
  }, [courseId]);
  
  const addTestToCourse = async (test) => {
    try {
      await firestore.collection('courses').doc(courseId).collection('tests').doc(test.id).set(test);
      console.log("Test added to course successfully!");
    } catch (error) {
      console.error("Error adding test to course:", error);
    }
  };
  

  return (
    <div className={className}>
    <label className="label" htmlFor="password">
      Question
    </label>
   
        <div className='list-tests'>
            {testsList.map((test2, index2) => (

            <div className="flex-space-btw">
              <p>Sr {index2 +1}</p>
              <p>{test2.Test_Name}</p>
              <div className='button-options'>
              <p>{test2.Status}</p>
              {disabledTests.includes(test2.id) ? (
              <button disabled className='btn-disabled'>Test is already added</button>
            ) : ( 
              <button onClick={() => addTestToCourse(test2)}>Add the Test</button>
            )}
              </div>
            </div>
              ))}

            </div>
        </div>
  );
};

export default CourseAddTest;
