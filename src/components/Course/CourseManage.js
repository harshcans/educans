import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore,firebase } from '../../firebase';
import Sidebar from '../Sidebar';
import '../CSS/course.css';
import CourseAddTest from './CourseAddTest';
import Popup from 'reactjs-popup';


const CourseManage = () => {
  const [TestList, SetTestList] = useState([  ]);
    const [style, setStyle] = useState("hidden");
    const { courseId } = useParams();
  const [activeItem, setActiveItem] = useState(1);
  const history = useNavigate();
  const [courseData, setCourseData] = useState([]);
  const [description, setDescription] = useState('');

  const changeStyle = () => {
    if (style !== "hidden") {
    setStyle("hidden");
    }
    else {
    setStyle("visible");
    }
};
  

  useEffect(() => {
    if (courseId) {
      const courseRef = firestore.collection('courses').doc(courseId);
      const testRef = firestore.collection('courses').doc(courseId).collection('tests');
      courseRef.get().then((doc) => {
        if (doc.exists) {
          // Document exists, set the userData state with the fields you need
          const { Description,ShortDescription,Annoucement } = doc.data();
          setCourseData({Description,ShortDescription,Annoucement });
        } else {
          // Document doesn't exist
          console.log('No such document!');
        }
      }).catch((error) => {
        // Error fetching document
        console.error('Error fetching document:', error);
      });
      testRef.get().then((querySnapshot) => {
      
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        SetTestList(usersData);
      })
        .catch((error) => {
          console.error('Error fetching users: ', error);
        });
    }else {
      console.error("testsId is empty or undefined.");
      // Handle the error or log it appropriately.
    }

  });

  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAddCourseDetails = () => {
    if (courseId) {
        const courseRef = firestore.collection('courses').doc(courseId).set({
            Description: description,
            timestamp: new Date()
            // timestamp: firestore.FieldValue.serverTimestamp()
      });
        
       
      }else {
        console.error("testsId is empty or undefined.");
        // Handle the error or log it appropriately.
      }
  };

  const handleRedirect = (courseID) => {
    history(`/author/${courseID}/manage?edit=questions`);
  }

  return (
    <div className='flex'>
      <Sidebar active="button3" />
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

              <h2>Course Id :  {courseId}</h2>
          </div>
          <div className="row-left">
            <i className="fa-regular fa-bell" />
            <i className="fa-solid fa-gear" />
            <i className="fa-regular fa-circle-user" />
          </div>
        </div>
        <div className='main-wrapper'>
          <div className='post2 course'>
            <div class="navbar">
        <ul>
             <li onClick={() => handleItemClick(1)} className={activeItem === 1 ? 'active' : 'list-item'}>
                <b class="left-curve"></b>
                <b class="right-curve"></b>
                <p>
                    Add Description
                </p>
            </li>
             <li onClick={() => handleItemClick(2)} className={activeItem === 2 ? 'active' : 'list-item'}>
                <b class="left-curve"></b>
                <b class="right-curve"></b>
                <p>
                    Make an Annoucement
                </p>
            </li>
        </ul>
    </div>

            <div className='text-post'>
            {activeItem === 1 ? (
                <div>
                    <button onClick={handleAddCourseDetails}>Click to Update or Add Description</button>
                    <input
                      type="text"
                      placeholder="Enter description"
                      value={description}
                      onChange={handleDescriptionChange}
                    />
                  
        <p> {courseData.Description} </p>
        </div>
      ) : (
        <p>Harsh</p>
      )}
            </div>
          </div>
          <div className='post flex-column'>
            <h2>Tests - </h2>
            <button onClick={changeStyle}>Want to Add Test</button>
{TestList.map((course, index) => (

            <div className='flex'>
              <div className='flex-column'>
                <p><b>Test Name : </b> {course.Test_Name} </p>
                <p><b>Test Format: </b> {course.Test_Format}</p>
              </div>
              <button className='ml-auto' onClick={() => handleRedirect(course.id)}>
                  <i className="fa-solid fa-caret-right"></i>

              </button>
            </div>
))}
          </div>
          <div className='form-container3'>
        <CourseAddTest className={style}/>

          </div>
        </div>
      </div>



    </div>
  );
};

export default CourseManage;
