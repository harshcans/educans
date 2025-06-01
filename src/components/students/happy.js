import React, { useState, useEffect } from 'react';
import { Link, useParams,useNavigate  } from "react-router-dom";
import "../../components/CSS/Homepage.css";
import Popup from 'reactjs-popup';
import { firestore, auth } from '../../firebase';
import Login from '../Login';



const Happy = () => {
    const { testID } = useParams();
    const [notloggedin, setNotloggedin] = useState(false);
    const [user, setUser] = useState(null);
  const history = useNavigate();
  
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
      history(`/testpanel/${testID}`);
   };

  return (
    <div className='home'>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white sticky snipcss-FY4cn style-bA3jh"
        data-offset={500}
        id="style-bA3jh"
      >
        <div className="container">
          <span className="navbar-brand">
            Edu<span className="text-primary">Grade.</span>
          </span>
          <button
            className="navbar-toggler"
            data-toggle="collapse"
            data-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="navbar-collapse collapse" id="navbarContent">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <span className="nav-link">Contact Us</span>
              </li>
              <Link to="/login">
                <li className="nav-item">
                  <span className="btn btn-primary ml-lg-2">Log In</span>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </nav>
      <div className="main2 container">
        <div className="row flex-column align-items-center flex-wrap-reverse h-100 snipcss-QSc22">
          <div className="flex card12">
            <div className="card-image">
              <img
                src="https://yespunjab.com/wp-content/uploads/2025/04/JEE-Main-logo-696x497.jpg"
                alt=""
              />
            </div>
            <div className="card-txt">
              <h1>JEE Mock Test</h1>
              <p> Physics Chemistry Mathematics</p>
            </div>
            <div className="btn btn-primary btn-split" onClick={handleStartExam} >
                  Start the Exam
                  <div className="fab">
                    <i className="fa-solid fa-caret-right"></i>
                  </div>
                </div>
          </div>
          <h3>Exam Deatils 👇</h3>
          <div className="flex w-100 crd12">
            <div className="card-detail">
              <div>
                <i className="fas fa-check " />
                <p>75 Questions</p>
              </div>
              <div>
                <i className="fas fa-check " />
                <p>3 Hour </p>
              </div>
              <div>
                <i className="fas fa-check" />
                <p>Negative Marking</p>
              </div>
            </div>
            <div>
            
            </div>
          </div>

          
        </div>
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
    </div>
  );
}

export default Happy;
