import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import "./CSS/loginsignup.css";

const Login = ({ redirect }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Check if user is a teacher
        const teacherRef = firestore
          .collection("teachers")
          .where("email", "==", user.email);
        teacherRef
          .get()
          .then((snapshot) => {
            if (!snapshot.empty) {
              // User is a teacher
              navigate("/author/creation");
            } else {
              navigate(redirect || "/dashboard");
            }
          })
          .catch((error) => {
            console.error("Error checking user role:", error);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);

      const user = auth.currentUser;
      if (user) {
        const teacherRef = firestore
          .collection("teachers")
          .where("email", "==", user.email);
        const snapshot = await teacherRef.get();

        if (!snapshot.empty) {
          // Teacher
          navigate("/author/creation");
        } else {
          // Student or general user
          navigate(redirect || "/user/dashboard");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login flex-column flex-center">
    <div className="overlay flex-center">
      <div className="session">
         <div className="logo-sidebar flex">
        <div className="logo-first-word">Grade</div>
        <div className="logo-second-word">Flow</div>
      </div>
        <form onSubmit={handleLogin} className="log-in" autoComplete="off">
          
          <p>Welcome back! Log in to your account:</p>
          <div className="flex-column" style={{width: "100%", gap: "10px" ,marginBottom: "20px"}}>
            <label htmlFor="email" style={{size: "15px"}}>Email:</label>            
            <input

              placeholder="Email"
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{size: "16px",height: "45px"}}
              required
              className="input-card input-size-full"
            />
          </div>

                             <div className="flex-column" style={{width: "100%", gap: "10px" ,marginBottom: "20px"}}>
                     <label htmlFor="password"  style={{size: "15px"}}> Password:</label>
            <input
              placeholder="Password"
              type="password"
              name="password"
              id="password"
              autoComplete="off"
              className="input-card input-size-full"
              style={{size: "16px",height: "45px"}}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Log in</button>
          <div className="discrete">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Login;
