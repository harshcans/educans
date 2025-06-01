import React, { useState, useEffect } from "react";
import { auth, firestore } from "../../firebase";
import { useNavigate, Navigate } from "react-router-dom";
import "../CSS/CreateTestFrom.css";
import Popup from "reactjs-popup";
import Sidebar from "../Sidebar";

const CreateTestMeta = ({closePopup }) => {
  const history = useNavigate();
  const [testName, setTestName] = useState("");
  const [testID, setTestID] = useState("");
  const [testFormat, setTestFormat] = useState("");
  const [error, setError] = useState("");
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherAndTests = async () => {
      setIsLoading(true);

      const user = auth.currentUser;

      if (user && user.email) {
        try {
          const teacherQuery = await firestore
            .collection("teachers")
            .where("email", "==", user.email)
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
              ...doc.data(), // Includes Id, Name, Status, Format
              Test_Id: doc.id,
            }));

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
    };

    fetchTeacherAndTests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const testNameRef = firestore
        .collection("tests")
        .where("Id", "==", testID);
      const testNameSnapshot = await testNameRef.get();

      if (!testNameSnapshot.empty) {
        setError("Test name already exists. Please choose a different name.");
        return;
      }

      const testDetails = {
        Id: testID,
        Name: testName,
        Format: testFormat,
        Status: "Draft",
      };

      // Save in global 'tests' collection
      await firestore.collection("tests").doc(testID).set(testDetails);

      // Save in teacher's nested 'tests' collection
      const teacherDoc = await firestore
        .collection("teachers")
        .where("email", "==", teacher.email)
        .get();

      if (!teacherDoc.empty) {
        const teacherDocId = teacherDoc.docs[0].id;

        await firestore
          .collection("teachers")
          .doc(teacherDocId)
          .collection("tests")
          .doc(testID)
          .set(testDetails);

        // Redirect to manage page
        history(`/author/creation/${testID}/manage?testId=${testID}`);
      } else {
        setError("Teacher document not found.");
      }
    } catch (error) {
      console.error("Error during test submission:", error);
      setError("Failed to create test. Try again.");
    }
  };

  return (
    <>
          <form className="form-container" onSubmit={handleSubmit}>
            <h2 className="title flex">Enter the details to Create Test
          <i className="fa-regular fa-circle-xmark ml-auto" onClick={closePopup}></i> </h2>

            <div className="password-container">
              <label className="label" htmlFor="password">
                Exam Name
              </label>
              <div className="input-container">
                <input
                  className="input-card input-size-full"
                  type="text"
                  placeholder="Your Exam Name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  required
                />
              </div>
              <div className="input-container">
                <input
                  className="input-card input-size-full"
                  type="text"
                  placeholder="Create your shareable Test Id"
                  value={testID}
                  onChange={(e) => setTestID(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-column">
              <label className="label" htmlFor="password">
                Select Exam Format
              </label>
              <select
                value={testFormat}
                className="select4"
                onChange={(e) => setTestFormat(e.target.value)}
                required
              >
                <option value="">Select Test Format</option>
                <option value="JEE Mains">JEE Mains</option>
                <option value="NEET">NEET</option>
                <option value="JEE Advance">JEE Advance</option>
                <option value="OTHERS">Custom (Create by own) </option>
              </select>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="btn-controls">
              <button type="submit">Create &amp; Next</button>
            </div>
          </form>
      </>
  );
};

export default CreateTestMeta;
