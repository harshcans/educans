import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import Sidebar from '../Sidebar';
import Popup from 'reactjs-popup';
import SidebarStudent from '../../SidebarStudent';


const CourseDashboard = () => {
  const { testName } = useParams();
  const [userData, setUserData] = useState(null);
  const [testId, setTestId] = useState('');
  const navigatee = useNavigate();


  useEffect(() => {
    const fetchTestId = async () => {
      try {
        const testsRef = firestore.collection('tests');
        const querySnapshot = await testsRef.where('Test_Name', '==', testName).get();
        console.log('test2', testName)
        if (!querySnapshot.empty) {
          // Assuming test_name is unique, so we directly get the first document
          const doc = querySnapshot.docs[0];
          setTestId(doc.id);
          // console.log(doc.id);
          const usersRef = firestore.collection('tests');
          const harshcansRef = usersRef.doc(doc.id);
          // console.log('harsh',test2Id);

          harshcansRef.get().then((doc) => {
            if (doc.exists) {
              // Document exists, set the userData state with the fields you need
              const { Test_Format } = doc.data();
              setUserData({ Test_Format });
            } else {
              // Document doesn't exist
              console.log('No such document!');
            }
          }).catch((error) => {
            // Error fetching document
            console.error('Error fetching document:', error);
          });
        } else {
          console.log('Test not found');
          navigatee('/teacher/test');
          // Handle case when test is not found
        }
      } catch (error) {
        console.error('Error fetching test ID:', error);
      }
    };

    fetchTestId();
    // fetchUserData();

  }, [testName]);




  return (
    <div className='flex'>
      <SidebarStudent active={'button3'} />
      <div className='main'>
        <div className="header flex">
        <div className="row-right">
             <Popup
      trigger={            <i className='fa-solid fa-bars' />    }
      position="bottom left"
      closeOnDocumentClick
      mouseLeaveDelay={300}
      mouseEnterDelay={0}
      contentStyle={{ padding: '0px', border: 'none' }}
      arrow={false}
    >
     <Sidebar />
    </Popup>

            <h3>Courses</h3>
          </div>
          <div className="row-left">
            <i className="fa-regular fa-bell" />
            <i className="fa-solid fa-gear" />
            <i className="fa-regular fa-circle-user" />
          </div>
        </div>
        <div className='main-wrapper3'>
        <div className="search-box">
  <div className="i-search">
    <i className="fa fa-search text-gray-400 z-20 hover:text-gray-500" />
  </div>
  <input type="text" className='input-search' placeholder="Search anything..." />
  <div className="button-search">
    <button> Search</button>
  </div>
</div>
          <div className='card-wrapper'>
            <div className="card">
              <div className="card-text">
                <h3>86 places</h3>
                <p>See your most visited places and the places you've been.</p>
              </div>
              <div className='click-i'>
                <i className="fas fa-chevron-right fa-2x" />
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default CourseDashboard;
