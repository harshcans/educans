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
              navigate(redirect || "/user/dashboard");
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
    <div className="login">
      <div className="header flex">
        <div className="row-right">
          <i className="fa-solid fa-bars" />
          <h2>
            {" "}
            Edu<span className="text-primary">Grade.</span>
          </h2>
        </div>
        <div className="row-left">
          <i className="fa-regular fa-bell" />
          <i className="fa-solid fa-gear" />
          <i className="fa-regular fa-circle-user" />
        </div>
      </div>

      <div className="session">
        <div className="left"></div>
        <form onSubmit={handleLogin} className="log-in" autoComplete="off">
          <h4>
            We are Edu<span className="text-primary">Grade.</span>
          </h4>
          <p>Welcome back! Log in to your account:</p>
          <div className="floating-label flex">
            <div className="flex-center">
              <i className="fa-regular fa-envelope i-big"></i>
            </div>
            <input
              placeholder="Email"
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email:</label>
          </div>

          <div className="floating-label flex">
            <div className="flex-center">
              <i className="fa-solid fa-lock i-big"></i>
            </div>
            <input
              placeholder="Password"
              type="password"
              name="password"
              id="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password:</label>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Log in</button>
          <div className="discrete">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
