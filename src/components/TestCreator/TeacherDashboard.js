import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import Sidebar from "../Sidebar";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import CreateTestMeta from "./CreateTestMeta";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [testsList, setTestsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const { email } = user;

        try {
          const teacherQuery = await firestore
            .collection("teachers")
            .where("email", "==", email)
            .get();

          if (!teacherQuery.empty) {
            const teacherDoc = teacherQuery.docs[0];
            const teacherData = teacherDoc.data();
            setTeacher(teacherData);

            const testsSnapshot = await firestore
              .collection("teachers")
              .doc(teacherDoc.id)
              .collection("tests")
              .get();

            const testsData = testsSnapshot.docs.map((doc) => ({
              ...doc.data(), // Includes Id, Name, Status, Total_Students
              Test_Id: doc.id, // Save doc ID separately
            }));

            setTestsList(testsData);
          } else {
            await auth.signOut();
          }
        } catch (error) {
          console.error("Error fetching teacher/tests:", error);
        }
      } else {
        setTeacher(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!teacher) {
    return <Navigate to="/login" />;
  }

  const EditQues = (testId) => {
    navigate(`/author/creation/${testId}/manage`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="main">
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
              <Sidebar />
            </Popup>
            <h2>Exam Paper Creation</h2>
          </div>
          <div className="row-left">
            <i className="fa-regular fa-bell" />
            <i className="fa-solid fa-gear" />
            <i className="fa-regular fa-circle-user" />
          </div>
        </div>
        <div className="main-wrapper">
          <Popup
            modal
            open={isPopupOpen}
            onOpen={() => setIsPopupOpen(true)}
            onClose={() => setIsPopupOpen(false)}
            trigger={
              <div
                className="add-question flex"
                onClick={() => setIsPopupOpen(true)}
              >
                <i className="fa-solid fa-circle-plus" />
                <p>Create New Exam!!</p>
              </div>
            }
            contentStyle={{
              padding: "0px",
              border: "none",
              background: "none",
            }}
          >
            <div className="popup-overlay">
              <div className="popup-center-box">
                <CreateTestMeta closePopup={() => setIsPopupOpen(false)} />
              </div>
            </div>
          </Popup>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Sno.</th>
                  <th>Test Name</th>
                  <th>Test Format</th>
                  <th>Status</th>
                  <th>Test Taker</th>
                  <th>Option</th>
                </tr>
              </thead>
              <tbody>
                {testsList.map((test, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{test.Name}</td>
                    <td>{test.Format}</td>
                    <td className="text-color">
                      <b>{test.Status}</b>
                    </td>
                    <td>23</td>
                    <td className="row-left">
                      <i
                        className="fa-regular fa-pen-to-square mr-lf-10 pointer"
                        onClick={() => EditQues(test.Id)}
                      />
                      <i
                        className="fa-solid fa-trash mr-lf-10 icon-link"
                        onClick={() => deleteUser(index + 1)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
