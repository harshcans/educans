// Dashboard.js
import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Popup from "reactjs-popup";
import "./CSS/Dashboard.css";
import SidebarStudent from "../SidebarStudent";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [previousTests, setPreviousTests] = useState([]);
  const [attemptedTests, setAttemptedTests] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);

        // Fetch upcoming tests
        const fetchUpcomingTests = async () => {
          const testsRef = firestore
            .collection("tests")
            .where("date", ">=", new Date());
          const snapshot = await testsRef.get();
          const upcomingTestsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUpcomingTests(upcomingTestsData);
        };
        fetchUpcomingTests();

        // Fetch previous tests
        const fetchPreviousTests = async () => {
          const testsRef = firestore
            .collection("tests")
            .where("date", "<", new Date());
          const snapshot = await testsRef.get();
          const previousTestsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPreviousTests(previousTestsData);
        };
        fetchPreviousTests();

        // Fetch attempted tests (assuming you have a 'results' collection)
        const fetchAttemptedTests = async () => {
          const resultsRef = firestore
            .collection("results")
            .where("userId", "==", user.uid);
          const snapshot = await resultsRef.get();
          const attemptedTestsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAttemptedTests(attemptedTestsData);
        };
        fetchAttemptedTests();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex ">
      <SidebarStudent active={"button1"} />
      <div className="main dashboard">
        <div className="header flex">
          <div className="row-right">
            <Popup
              trigger={<i className="fa-solid fa-bars" />}
              position="bottom left"
              closeOnDocumentClick
              mouseLeaveDelay={300}
              mouseEnterDelay={0}
              contentStyle={{ padding: "0px", border: "none" }}
              arrow={false}
            >
              <SidebarStudent />
            </Popup>
            {user && <h3>Dashboard ( {user.email} )</h3>}
          </div>
          <div className="row-left">
            <i className="fa-regular fa-bell" />
            <i className="fa-solid fa-gear" />
            <i className="fa-regular fa-circle-user" />
          </div>
        </div>
        <div id="view-dashboard" className="view-content">
      <div className="welcome-card">
        <h2 className="welcome-title">Welcome back, Alex!</h2>
        <p className="welcome-text">
          You have <strong className="text-blue">2 upcoming tests</strong> and{' '}
          <strong className="text-green">1 new result</strong>. Stay focused and prepared!
        </p>
      </div>

      <div className="grid-layout">
        {/* Upcoming Tests Card */}
        <div className="card col-span-2">
          <h3 className="card-title">Upcoming Tests</h3>
          <p className="card-description">
            This section highlights your most immediate upcoming tests. Click "View Details" for more information or "Start Test" when it's time.
          </p>
          <div className="list-space-y">
            {/* Test 1 */}
            <div className="list-item">
              <div className="list-item-header">
                <div>
                  <h4 className="item-title">Mathematics Midterm - Algebra</h4>
                  <p className="item-text-sm">Subject: Mathematics</p>
                  <p className="item-text-sm">Date: June 10, 2025 | 10:00 AM</p>
                </div>
                <span id="countdown-math" className="countdown-text">1d 19h 58m left</span>
              </div>
              <div className="item-actions">
                <button className="btn btn-primary">View Details</button>
                <button className="btn btn-success">Start Test</button>
              </div>
            </div>
            {/* Test 2 */}
            <div className="list-item">
              <div className="list-item-header">
                <div>
                  <h4 className="item-title">Physics Fundamentals - Unit 2</h4>
                  <p className="item-text-sm">Subject: Physics</p>
                  <p className="item-text-sm">Date: June 12, 2025 | 02:00 PM</p>
                </div>
                <span id="countdown-physics" className="countdown-text">3d 23h 58m left</span>
              </div>
              <div className="item-actions">
                <button className="btn btn-primary">View Details</button>
                <button className="btn btn-disabled" disabled>Start Test</button>
              </div>
            </div>
          </div>
          <a href="#" data-view="upcomingTests" className="link-action">View All Upcoming Tests →</a>
        </div>

        {/* Recent Results */}
        <div className="card">
          <h3 className="card-title">Recent Results</h3>
          <p className="card-description">
            Check your latest test results here. Click "View Detailed Results" to see your performance breakdown.
          </p>
          <div className="list-space-y">
            <div className="list-item">
              <h4 className="item-title text-green">Chemistry Basics - Unit 1</h4>
              <p className="item-text-sm">Subject: Chemistry</p>
              <p className="item-text-sm">Date Taken: June 01, 2025</p>
              <p className="item-text-sm font-medium">
                Score: <span className="text-green">85/100 (Passed)</span>
              </p>
              <p className="item-text-sm text-gray">Status: Graded</p>
              <button className="btn btn-info">View Detailed Results</button>
            </div>
          </div>
          <a href="#" data-view="attemptedTests" className="link-action">View All Results →</a>
        </div>

        {/* Performance Snapshot */}
        <div className="card">
          <h3 className="card-title">Performance Snapshot</h3>
          <p className="card-description">
            A quick visual summary of your recent test performance. For a detailed analysis, visit the full analytics page.
          </p>
          <div className="chart-container">
            <canvas
              id="performanceChart"
              width="300"
              height="300"
              style={{ display: 'block', boxSizing: 'border-box', height: '300px', width: '300px' }}
            />
          </div>
          <a href="#" data-view="overallPerformance" className="link-action">Go to Analytics →</a>
        </div>

        {/* Quick Links */}
        <div className="card col-span-2">
          <h3 className="card-title">Quick Links & Resources</h3>
          <p className="card-description">
            Quickly access frequently used sections or personalized study suggestions to help you prepare effectively.
          </p>
          <div className="quick-link-grid">
            <a href="#" data-view="practiceTests" className="quick-link-item">
              <span className="quick-link-icon">🏋️</span><span>Explore Practice Tests</span>
            </a>
            <a href="#" data-view="studyResources" className="quick-link-item green">
              <span className="quick-link-icon">💡</span><span>Access Math Study Guides</span>
            </a>
            <a href="#" data-view="announcements" className="quick-link-item yellow">
              <span className="quick-link-icon">🗣️</span><span>View Latest Announcements</span>
            </a>
            <a href="#" data-view="support" className="quick-link-item purple">
              <span className="quick-link-icon">🤝</span><span>Contact Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
};

export default Dashboard;
