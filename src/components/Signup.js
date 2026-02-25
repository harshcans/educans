// signup.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      // Redirect to login page after successful signup
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup flex-center">
      <div className="overlay flex-center">
        <div className="session">
          <div className="flex">
            <h4>We are &nbsp;</h4>
              <div className="logo-sidebar flex">
                <div className="logo-first-word">Grade</div>
                <div className="logo-second-word">Flow</div>
              </div>
            </div>
          <form onSubmit={handleSignup} className="log-in" autoComplete="off">
            
            <p>Get Ready with Your New Account</p>
            <div
              className="flex-column"
              style={{ width: "100%", gap: "10px", marginBottom: "20px" }}
            >
             
              <label htmlFor="email" style={{ size: "15px" }}>
                Email:
              </label>
              <input
                placeholder="Email"
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                
                style={{ size: "16px", height: "45px" }}
                required
                className="input-card input-size-full"
              />
            </div>
            <div
              className="flex-column"
              style={{ width: "100%", gap: "10px", marginBottom: "20px" }}
            >
               <label htmlFor="password" style={{ size: "15px" }}>
                              {" "}
                              Password:
                            </label>
              <input
                placeholder="Password"
                type="password"
                name="password"
                autoComplete="off"
                id="password"
               className="input-card input-size-full"
                style={{ size: "16px", height: "45px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Sign Up</button>
            <div className="discrete">
              Already have an account? <Link to="/login">Login</Link>
              {error && <p>{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
