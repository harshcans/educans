import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore, auth } from '../../firebase';
import Sidebar from '../Sidebar';

const TestMaking = () => {
  const { testID } = useParams();
  const navigate = useNavigate();

  const [testMeta, setTestMeta] = useState(null);
  const [subjectSections, setSubjectSections] = useState([]);

  const [subject, setSubject] = useState('');
  const [section, setSection] = useState('');
  const [question, setQuestion] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [correctOption, setCorrectOption] = useState('');

  const allSubjects = subjectSections.map(sec => sec.subject);
  const currentSections = subjectSections.find(s => s.subject === subject)?.sections || [];

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (!user) {
      console.error('User not logged in');
      navigate('/login');  // Redirect to login if unauthenticated
      return;
    }

    try {
      const testDoc = await firestore.collection('tests').doc(testID).get();

      if (testDoc.exists) {
        const data = testDoc.data();
        setTestMeta(data);
        const format = data.Format;

        switch (format) {
          case 'JEE Mains':
            setSubjectSections([
              {
                subject: 'Mathematics',
                sections: [
                  { type: 'MCQs', total: 20, optional: 0 },
                  { type: 'Integer Type', total: 10, optional: 5 }
                ]
              },
              {
                subject: 'Physics',
                sections: [
                  { type: 'MCQs', total: 20, optional: 0 },
                  { type: 'Integer Type', total: 10, optional: 5 }
                ]
              },
              {
                subject: 'Chemistry',
                sections: [
                  { type: 'MCQs', total: 20, optional: 0 },
                  { type: 'Integer Type', total: 10, optional: 5 }
                ]
              }
            ]);
            break;

          case 'NEET':
            setSubjectSections([
              {
                subject: 'Physics',
                sections: [{ type: 'MCQs', total: 50, optional: 10 }]
              },
              {
                subject: 'Chemistry',
                sections: [{ type: 'MCQs', total: 50, optional: 10 }]
              },
              {
                subject: 'Biology',
                sections: [{ type: 'MCQs', total: 100, optional: 20 }]
              }
            ]);
            break;

          default:
            setSubjectSections([]);
        }
      } else {
        console.warn('Test metadata not found.');
      }
    } catch (err) {
      console.error('Failed to fetch test metadata:', err);
    }
  });

  return () => unsubscribe(); // cleanup
}, [testID, navigate]);


  const handleSubmit = async (e) => {
  e.preventDefault();

  const options = [option1, option2, option3, option4];
  const correctIndex = parseInt(correctOption) - 1;

  if (correctIndex < 0 || correctIndex > 3) {
    alert("Please select a valid correct option (1-4)");
    return;
  }

  try {
    const questionsRef = firestore.collection("tests").doc(testID).collection("questions");

    // Get all existing questions to calculate next question number
    const snapshot = await questionsRef.get();
    const questionCount = snapshot.size;
    const newQuestionID = `question${questionCount + 1}`;

    await questionsRef.doc(newQuestionID).set({
      subject,
      section,
      question,
      options,
      correctOption: correctIndex,
    });

    alert("Question added successfully!");
    navigate(`/author/creation/${testID}`);
  } catch (error) {
    console.error("Error adding question:", error);
    alert("Failed to add question.");
  }
};


  return (
    <div className="flex">
      <Sidebar />
      <div className="main p-4">
        {testMeta ? (
          <form onSubmit={handleSubmit} className="form-container3 space-y-4">
            <h2 className="text-xl font-semibold">Add New Question</h2>

            <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
              <option value="">Select Subject</option>
              {allSubjects.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>

            <select value={section} onChange={(e) => setSection(e.target.value)} required>
              <option value="">Select Section</option>
              {currentSections.map((sec, idx) => (
                <option key={idx} value={sec.type}>{sec.type}</option>
              ))}
            </select>

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter question"
              required
            />

            {[option1, option2, option3, option4].map((opt, idx) => (
              <input
                key={idx}
                type="text"
                value={opt}
                onChange={(e) => {
                  const setters = [setOption1, setOption2, setOption3, setOption4];
                  setters[idx](e.target.value);
                }}
                placeholder={`Option ${idx + 1}`}
                required
              />
            ))}

            <select value={correctOption} onChange={(e) => setCorrectOption(e.target.value)} required>
              <option value="">Select Correct Option</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>Option {n}</option>
              ))}
            </select>

            <button type="submit" className="btn btn-primary">Save & Done 🚀</button>
          </form>
        ) : (
          <p>Loading test metadata...</p>
        )}
      </div>
    </div>
  );
};

export default TestMaking;
