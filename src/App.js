import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/students/Dashboard";
import AdminDashboard from "./components/AdminDashboards";
import TeacherDashboard from "./components/TestCreator/TeacherDashboard";
import CreateTestMeta from "./components/TestCreator/CreateTestMeta";
import TestMaking from "./components/TestCreator/TestMaking";
import Happy from "./components/students/happy";
import TestLibrary from "./components/students/TestLibrary";
import "./components/CSS/index.css";
import HomePage from "./Home";
import ResultPage from "./components/students/Result";
import TestView from "./components/students/TestView";
import AddQuestionForm from "./components/TestCreator/AddQuestionForm";
import QuestionManager from "./components/TestCreator/QuestionManager";
import "./components/CSS/media.css";

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/author/creation/new" element={<CreateTestMeta />} />
          <Route path="/author/creation" element={<TeacherDashboard />} />
          <Route
            path="/author/creation/:testID/manage"
            element={<QuestionManager />}
          />
          <Route
            path="/author/creation/:testID/add-question"
            element={<AddQuestionForm />}
          />
          <Route path="/testpanel/:testID" element={<TestView />} />
          <Route path="/exam/share/:testID" element={<Happy />} />
          <Route path="/result/:testID" element={<ResultPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tests/library" element={<TestLibrary />} />
        
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {/* </div> */}
    </Router>
  );
}

export default App;
