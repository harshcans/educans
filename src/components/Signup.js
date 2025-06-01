// signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            // Redirect to login page after successful signup
            navigate('/login');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className='signup'>
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
        <form onSubmit={handleSignup} className="log-in" autoComplete='off'>
          <h4>
            We are Edu<span className="text-primary">Grade.</span>
          </h4>
          <p>Get Ready with Your New Account</p>
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
            Sign in
          </button>
          <div className='discrete'>Already have an account? <Link to="/login">Login</Link>
          {error && <p>{error}</p>}
          </div>
        </form>
      </div>
        </div>
    );
};

export default Signup;
