import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/students/Dashboard";
import AdminDashboard from "./components/AdminDashboards";
import TeacherDashboard from "./components/TestCreator/TeacherDashboard";
import CreateTestMeta from "./components/TestCreator/CreateTestMeta";
import TestView from "./components/students/TestView";
import Happy from "./components/students/happy";
import ResultPage from "./components/students/Result";
import TestLibrary from "./components/students/TestLibrary";
import AddQuestionForm from "./components/TestCreator/AddQuestionForm";
import QuestionManager from "./components/TestCreator/QuestionManager";
import HomePage from "./Home";

import "./components/CSS/index.css";
import "./components/CSS/media.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboards */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/author/creation" element={<TeacherDashboard />} />

          {/* Test Creation */}
          <Route path="/author/creation/new" element={<CreateTestMeta />} />
          <Route
            path="/author/creation/:testID/manage"
            element={<QuestionManager />}
          />
          <Route
            path="/author/creation/:testID/add-question"
            element={<AddQuestionForm />}
          />

          {/* Student Test Routes */}
          <Route path="/testpanel/:testID" element={<TestView />} />
          <Route path="/exam/share/:testID" element={<Happy />} />
          <Route path="/result/:testID" element={<ResultPage />} />
          <Route path="/tests/library" element={<TestLibrary />} />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
