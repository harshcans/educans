import React, { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithCustomToken,
} from 'firebase/auth';
import { auth, db } from '../../firebase'; // Firebase auth & db

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);
    });


    return () => unsubscribe();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage('Signup successful!');
      setEmail('');
      setPassword('');
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setMessage('Email already in use.');
          break;
        case 'auth/invalid-email':
          setMessage('Invalid email.');
          break;
        case 'auth/weak-password':
          setMessage('Weak password (min 6 characters).');
          break;
        default:
          setMessage(`Signup failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Login successful!');
      setEmail('');
      setPassword('');
    } catch (error) {
      switch (error.code) {
        
        case 'auth/user-not-found':
          setMessage('User not found.');
          break;
        case 'auth/wrong-password':
          setMessage('Wrong password.');
          break;
          case 'auth/invalid-credential':
          setMessage('Invalid email or password.');
          break;
        default:
          setMessage(`Login failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
      // window.location.reload();

    }
  };


  return (
    <div className="login">
      <div className="session" style={{width : '100%' , flexDirection:'column'}}>

        {message && (
          <div className='created-by-ai'>
            {message}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="ml-3 text-gray-600">Loading...</p>
          </div>
        )}

        
          <form onSubmit={isLoginMode ? handleLogin : handleSignUp} className="log-in"  style={{width : '100%'}}>
          <h2 className="modal-header">Please {(isLoginMode ? 'Login' : 'Sign Up')} to Attempt Test</h2>
            <div className="floating-label flex">
                <div className="flex-center">
              <i className="fa-regular fa-envelope i-big"></i>
            </div>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <label htmlFor="email" >Email</label>
            </div>
            <div className="floating-label flex">
                  <div className="flex-center">
              <i className="fa-solid fa-lock i-big"></i>
            </div>
              <input
                type="password"
                id="password"
              name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <label htmlFor="password" >Password</label>
            </div>
            <button type="submit">
              {isLoginMode ? 'Login' : 'Sign Up'}
            </button>

            <div className="discrete row-center w-100">
              {isLoginMode ? "Don't have an account?" : "Already have an account? "}
  &nbsp;   <div className="pointer" style={{color:'var(--text-color)',textDecoration:'underline'}} onClick={() => {
                setIsLoginMode(!isLoginMode);
                setMessage('');
                setEmail('');
                setPassword(''); }}>
               {isLoginMode ? ' Sign Up' : ' Log In'}
    </div>
           
            </div>
          </form>
       
      </div>
    </div>
  );
}

export default App;
