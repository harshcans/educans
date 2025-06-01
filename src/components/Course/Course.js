// Dashboard.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { auth, firestore } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import CourseAddTest from './CourseAddTest';
import Popup from 'reactjs-popup';


const Courses = () => {
  const [courses2, setCourses2] = useState([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [courseid, setCourseId] = useState('');
  const [style, setStyle] = useState("hidden");
  const [style3, setStyle3] = useState("password-container");
  const [style4, setStyle4] = useState("hidden");
  const [testsList, setUsersList] = useState([]);
  const [style2, setStyle2] = useState("visible");
  const history = useNavigate();
  const teachertestid = 'testsId'

  const changeStyle = () => {
    if (style !== "hidden") {
      setStyle("hidden");
      setStyle2("hidden");
    }
    else {
      setStyle2("hidden");
      setStyle("visible");
    }
  };
  const changeStyle2 = () => {
    if (style !== "visible") {
      setStyle("visible");
      setStyle2("hidden");
    }
    else {
      setStyle2("visible");
      setStyle("hidden");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = firestore.collection('courses');
        const snapshot = await coursesRef.get();
        const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses2(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchQuestions = () => {
      if (teachertestid) {
        const testsRef = firestore.collection('teachers').doc('harshcans@gmail.com').collection('tests');


        testsRef.get().then((querySnapshot) => {

          const usersData = [];
          querySnapshot.forEach((doc) => {
            usersData.push({ id: doc.id, ...doc.data() });
          });
          setUsersList(usersData);
        })
          .catch((error) => {
            console.error('Error fetching users: ', error);
          });
        // Use testsRef further...
      } else {
        console.error("testsId is empty or undefined.");
        // Handle the error or log it appropriately.
      }


    };

    fetchCourses();
    fetchQuestions();
  }, []);

  const handleRedirect = (courseID) => {
    history(`/teacher/${courseID}/manage`);
  }

  const addCourse = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      if (!newCourseName || !courseid) {
        console.error('Course name and ID are required.');
        return;
      }

      const coursesRef = firestore.collection('courses');
      const existingCourse = await coursesRef.doc(courseid).get();

      if (existingCourse.exists) {
        console.error('Course with the provided ID already exists.');
        return;
      }

      await coursesRef.doc(courseid).set({
        courseName: newCourseName,
      });

      const newCourseRef = await firestore.collection('teachers').doc('harshcans@gmail.com').collection('courses');
      await newCourseRef.doc(courseid).set({
        courseName: newCourseName,
      });
      history(`/teacher/course?courseId=${courseid}`)
      setStyle3('hidden');
      setStyle4('password-container');
      setNewCourseName('');
      setCourseId('');
      console.log('New course added with ID:', courseid);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };




  return (
    <div className='flex'>
      <Sidebar />
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
            <h2>Courses Creation</h2>
          </div>
          <div className="row-left">
            <i className="fa-regular fa-bell" />
            <i className="fa-solid fa-gear" />
            <i className="fa-regular fa-circle-user" />
          </div>
        </div>
        <div className='main-wrapper'>
          <div className={style} >
            <form onSubmit={addCourse} className='form-container3'>
              <div className='flex'>
                <h1 className="title">Create a New Course!! </h1>
                <i className="fa-regular fa-circle-xmark ml-auto" onClick={changeStyle2}></i>
              </div>


              <div className={style3}>
                <label className="label" htmlFor="password">
                  Question:
                </label>
                <div className="input-container">
                  <input
                    className="input-card input-size-full"
                    type="text"
                    value={newCourseName}
                    onChange={e => setNewCourseName(e.target.value)}
                    placeholder="Enter new course name" required
                  />
                </div>
              </div>
              <div className={style3}>
                <label className="label" htmlFor="password">
                  Question:
                </label>
                <div className="input-container">
                  <input
                    className="input-card input-size-full"
                    type="text"
                    value={courseid}
                    onChange={e => setCourseId(e.target.value)}
                    placeholder="Enter new course id"
                  />
                </div>
              </div>
              <CourseAddTest className={style4} />

              <div className="btn-controls flex-center">
                <button type="submit" >Save &amp; Done 🚀</button>
              </div>
            </form>
          </div>

          <div className={style2}>
            <nav className='flex'>
              <div className="btn-controls" onClick={changeStyle}>
                <button>Add New Course</button>
                <i className="fa-solid fa-plus"></i>
              </div>
              <select className='select3 ml-auto'>
                <option>Filter the Content</option>
                <option>Questions</option>
                <option>Format</option>
              </select>
            </nav>
            <div className='post flex-column'>
              <h2>Tests - </h2>
              {courses2.map((course, index) => (
                <div className='flex'>
                  <div className='flex-column'>
                    <p><b>Course Name : </b> {course.courseName} </p>
                    <p><b>Course Id: </b> {course.id}</p>
                  </div>
                  <button className='ml-auto' onClick={() => handleRedirect(course.id)}>
                    <i className="fa-solid fa-caret-right" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
