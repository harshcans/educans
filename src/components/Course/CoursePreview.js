import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import Sidebar from '../Sidebar';
import '../CSS/course.css';
import Popup from 'reactjs-popup';


const CoursePreview = () => {
  const { courseId } = useParams();
  const [CourseList, setCourseList] = useState([  ]);
  const [activeItem, setActiveItem] = useState(1);
  const history = useNavigate();


  useEffect(() => {
    if (courseId) {
      const courseRef = firestore.collection('courses').doc(courseId).collection('tests');
      courseRef.get().then((querySnapshot) => {
      
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        setCourseList(usersData);
      })
        .catch((error) => {
          console.error('Error fetching users: ', error);
        });
    }else {
      console.error("testsId is empty or undefined.");
    }

  });

  const handleItemClick = (index) => {
    setActiveItem(index);
  };
  const handleRedirect = (courseID) => {
    history(`/testpanel/${courseID}`);
  }

  return (
    <div className='flex course'>
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

            <h3>Courses</h3>
          </div>
          <div className="row-left">
            <i className="fa-regular fa-bell" />
            <i className="fa-solid fa-gear" />
            <i className="fa-regular fa-circle-user" />
          </div>
        </div>
        <div className='main-wrapper'>
          <div className='post2'>
            <div class="navbar">
        <ul>
             <li onClick={() => handleItemClick(1)} className={activeItem === 1 ? 'active' : 'list-item'}>
                <b class="left-curve"></b>
                <b class="right-curve"></b>
                <p>
                    <i class="fa fa-home"></i>
                    Home
                </p>
            </li>
             <li onClick={() => handleItemClick(2)} className={activeItem === 2 ? 'active' : 'list-item'}>
                <b class="left-curve"></b>
                <b class="right-curve"></b>
                <p>
                    <i class="fa fa-book"></i>
                    My Courses
                </p>
            </li>
        </ul>
    </div>

            <div className='text-post'>
            {activeItem === 1 ? (
        <p>This Course Id is made by US</p>
      ) : (
        <p>Harsh</p>
      )}
            </div>
          </div>
          <div className='post flex-column'>
            <h2>Tests - </h2>
{CourseList.map((course, index) => (

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
        </div>
      </div>



    </div>
  );
};

export default CoursePreview;
