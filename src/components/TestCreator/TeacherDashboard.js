import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import CreateTestMeta from "./CreateTestMeta";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [testsList, setTestsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { email } = user;
        console.log("Logged in user email:", email);

        try {
          const q = query(
            collection(db, "teachers"),
            where("email", "==", email)
          );
          const teacherQuerySnapshot = await getDocs(q);

          if (!teacherQuerySnapshot.empty) {
            const teacherDoc = teacherQuerySnapshot.docs[0];
            const teacherData = teacherDoc.data();
            setTeacher(teacherData);
            console.log("Teacher data found:", teacherData);

            const testsRef = collection(db, "teachers", teacherDoc.id, "tests");
            const testsSnapshot = await getDocs(testsRef);

            const testsData = testsSnapshot.docs.map((doc) => ({
              ...doc.data(),
              Test_Id: doc.id,
            }));

            setTestsList(testsData);
          } else {
            console.log("Teacher not found, signing out.");
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching teacher/tests:", error);
        }
      } else {
        console.log("No user is signed in.");
        navigate("/login");
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const EditQues = (testId) => {
    navigate(`/author/creation/${testId}/manage`);
  };

  return (
    <div className="flex">
      <Sidebar active="button2" />
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testsList.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      Loading...
                    </td>
                  </tr>
                ) : (
                  testsList.map((test, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{test.Name}</td>
                      <td>{test.Format}</td>
                      <td className="text-color">
                        <b>{test.Status}</b>
                      </td>
                      <td>23</td>
                      <td className="row-center flex action-btn">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          style={{ cursor: "pointer" }}
                          color="#3730a3"
                          fill="none"
                          onClick={() => EditQues(test.Test_Id)}
                        >
                          <path
                            d="M3.49977 18.9853V20.5H5.01449C6.24074 20.5 6.85387 20.5 7.40518 20.2716C7.9565 20.0433 8.39004 19.6097 9.25713 18.7426L19.1211 8.87868C20.0037 7.99612 20.4449 7.55483 20.4937 7.01325C20.5018 6.92372 20.5018 6.83364 20.4937 6.74411C20.4449 6.20253 20.0037 5.76124 19.1211 4.87868C18.2385 3.99612 17.7972 3.55483 17.2557 3.50605C17.1661 3.49798 17.0761 3.49798 16.9865 3.50605C16.4449 3.55483 16.0037 3.99612 15.1211 4.87868L5.25713 14.7426C4.39004 15.6097 3.9565 16.0433 3.72813 16.5946C3.49977 17.1459 3.49977 17.759 3.49977 18.9853Z"
                            stroke="#141B34"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M13.5 6.5L17.5 10.5"
                            stroke="#141B34"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          color="#000000"
                          fill="none"
                          style={{ cursor: "pointer" }}
                        >
                          <path
                            d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          ></path>
                          <path
                            d="M9 11.7349H15"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          ></path>
                          <path
                            d="M10.5 15.6543H13.5"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          ></path>
                          <path
                            d="M3 5.5H21M16.0555 5.5L15.3729 4.09173C14.9194 3.15626 14.6926 2.68852 14.3015 2.39681C14.2148 2.3321 14.1229 2.27454 14.0268 2.2247C13.5937 2 13.0739 2 12.0343 2C10.9686 2 10.4358 2 9.99549 2.23412C9.89791 2.28601 9.80479 2.3459 9.7171 2.41317C9.32145 2.7167 9.10044 3.20155 8.65842 4.17126L8.05273 5.5"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          ></path>
                        </svg>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
