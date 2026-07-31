import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, firestore } from "../firebase";
import "./CSS/loginsignup.css";

// SVG Icons for Educans Header Navigation
const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
  </svg>
);

const Login = ({ redirect }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  
  // UI state to sync header role selection with URL query string
  const [selectedRole, setSelectedRole] = useState("student");
  
  const navigate = useNavigate();
  const location = useLocation();

  // Read ?selec= parameter from URL on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("selec");
    if (roleParam === "teacher" || roleParam === "student") {
      setSelectedRole(roleParam);
    }
  }, [location.search]);

  // Handler for Student/Teacher top header buttons
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    navigate(`/login?selec=${role}`);
  };

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
    <div className="app-wrapper home" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Top Navigation Header */}
      <nav className="ed-nav">
        <div className="ed-container ed-nav-inner">
          <Link to="/" className="ed-logo" style={{ textDecoration: "none" }}>
            <div className="ed-logo-icon">
              <BookIcon />
            </div>
            <span className="ed-logo-text">Educans</span>
          </Link>


          {/* Header Action Buttons for Student / Teacher Route Switching */}
          <div className="ed-nav-actions">
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button
                type="button"
                className={`ed-btn ${selectedRole === "student" ? "ed-btn-primary" : "ed-btn-secondary"}`}
                onClick={() => handleRoleChange("student")}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <CapIcon /> Student
              </button>
              <button
                type="button"
                className={`ed-btn ${selectedRole === "teacher" ? "ed-btn-primary" : "ed-btn-secondary"}`}
                onClick={() => handleRoleChange("teacher")}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <BookIcon /> Teacher
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container styled like Homepage Hero */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "1.5rem" }}>
        <section className="ed-hero" style={{ width: "100%", maxWidth: "600px", padding: "0" }}>
          <div className="ed-hero-bg" />

          <div className="ed-card" style={{ padding: "2.5rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", position: "relative", zIndex: 2 }}>
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
              <div className="ed-badge-pill" style={{ display: "inline-flex", marginBottom: "0.75rem" }}>
                <SparkleIcon /> {selectedRole === "student" ? "Student Portal" : "Faculty / Teacher Portal"}
              </div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-main)", margin: "0 0 0.25rem 0" }}>
                Welcome back!
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
                Log in to your account:
              </p>
            </div>

            {/* Login Form keeping exact fields and handlers */}
            <form onSubmit={handleLogin} className="ed-form" autoComplete="off">
              
              <div className="ed-form-group">
                <label htmlFor="email" className="ed-label">Email:</label>
                <input
                  placeholder="Email"
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="ed-input"
                />
              </div>

              <div className="ed-form-group">
                <label htmlFor="password" className="ed-label">Password:</label>
                <input
                  placeholder="Password"
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="off"
                  className="ed-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div style={{ color: "#ef4444", fontSize: "0.85rem", backgroundColor: "#fef2f2", padding: "0.6rem 0.8rem", borderRadius: "var(--radius-sm)", border: "1px solid #fca5a5" }}>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="ed-btn ed-btn-primary" 
                style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem", fontWeight: 800, marginTop: "0.5rem" }}
              >
                Log in
              </button>

              <div className="discrete" style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Don't have an account?{" "}
                <Link to={`/signup?selec=${selectedRole}`} style={{ color: "var(--accent-primary)", fontWeight: 700, textDecoration: "none" }}>
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "1.25rem 0", backgroundColor: "#ffffff", textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)" }}>
        <div className="ed-container">
          <p>© {new Date().getFullYear()} GradeFlow Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;