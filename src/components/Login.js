// login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import './CSS/loginsignup.css';

const Login = ({testpanellink}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [testspanel, setTestspanel] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [teacherName, setTeacherName] = useState('');

    useEffect(() => {
        // Check if user is already authenticated
       if (testpanellink){
        setTestspanel(`/testpanel/${testpanellink}`);
        console.log('found',testpanellink)
       }
       else{
        setTestspanel("/user/dashboard")
        console.log('found not')

       }
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is already authenticated
                // Check if user email is in teachers collection
                const teacherRef = firestore.collection('teachers').where('email', '==', user.email);
                teacherRef.get().then((snapshot) => {
                    if (!snapshot.empty) {
                        // User is a teacher
                        // Retrieve teacher's name
                        const teacherData = snapshot.docs[0].data();
                        navigate('/author/creation');
                    } else {
                        navigate(testspanel);
                    }
                }).catch((error) => {
                    console.error('Error checking user role:', error);
                });
            }
        });

        return () => unsubscribe();
    }, [testspanel]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
      <div className="login">
        <div className="header flex">
          <div className="row-right">
            <i className='fa-solid fa-bars' />
            <h2> Edu<span className="text-primary">Grade.</span></h2>
          </div>
          <div className="row-left">
            <i className="fa-regular fa-bell" />
            <i className="fa-solid fa-gear" />
            <i className="fa-regular fa-circle-user" />
          </div>
        </div>
        <div className="session">
        <div className="left"></div>
        <form onSubmit={handleLogin} className="log-in" autoComplete='off'>
          <h4>
            We are Edu<span className="text-primary">Grade.</span>
          </h4>
          <p>Welcome back! Log in to your account:</p>
          <div className="floating-label flex">
          <div className="flex-center">
            <i class="fa-regular fa-envelope i-big"></i>
            </div> <input
              placeholder="Email"
              type="email"
              name="email"
              id="email"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
            <label htmlFor="email">Email:</label>
            
          </div>
          <div className="floating-label flex">
          <div className="flex-center">
            <i class="fa-solid fa-lock i-big"></i>
            </div> <input
              placeholder="Password"
              type="password"
              name="password"
              autoComplete='off'
              id="password"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
            <label htmlFor="password">Password:</label>
            
          </div>
          <button type="submit">
            Log in
          </button>
          <div className='discrete'>Don't have an account? <Link to="/signup">Sign up</Link></div>
        </form>
      </div>
      </div>
      
    );
};

export default Login;
