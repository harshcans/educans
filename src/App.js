import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboards';
import TeacherDashboard from './components/TestCreator/TeacherDashboard';
import CreateTestMeta from './components/TestCreator/CreateTestMeta';
import TestMaking from './components/TestCreator/TestMaking';
import Happy from './components/students/happy';
import './components/CSS/index.css';
import HomePage from './Home';
import ResultPage from './components/students/Result';
import Courses from './components/Course/Course';
import CourseDashboard from './components/Course/CourseDashboard';
import CoursePreview from './components/Course/CoursePreview';
import CourseManage from './components/Course/CourseManage';
import TestView from './components/students/TestView';
import AddQuestionForm from './components/TestCreator/AddQuestionForm';
import TestQuestionForm from './components/TestCreator/TestQuestionForm';
import './components/CSS/media.css';

function App() {
    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            // Do something with 'user' if needed
        });

        return unsubscribe;
    }, []);

    return (
        <Router>
            <div className="App">
                {/* <Sidebar /> */}
                {/* <div className='main'> */}
                    <Routes>
                    <Route path="/author/creation/new" element={<CreateTestMeta />} />
                        <Route path="/author/creation" element={<TeacherDashboard />} />
                        <Route path="/author/course" element={<Courses />} />
                        <Route path="/author/creation/:testID/manage" element={<TestQuestionForm />} />
                        <Route path="/author/creation/:testID/add-question" element={<AddQuestionForm />} />
                        <Route path="/testpanel/:testID" element={<TestView />} />
                        <Route path="/exam/share/:testID" element={<Happy />} />
                        <Route path="/result/:testID" element={<ResultPage />} />
                        <Route path="/user/dashboard" element={<Dashboard />} />
                        <Route path="/user/courses" element={<CourseDashboard />} />
                        <Route path="/courses/:courseId" element={<CoursePreview />} />
                        <Route path="/author/:courseId/manage" element={<CourseManage />} />
                        <Route path="/" element={<HomePage />} />
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
    
