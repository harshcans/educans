import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore, auth } from '../../firebase';
import '../CSS/Result.css'; // Assuming you have a CSS file for styling

const ResultPage = () => {
  const { testID } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState([]); // Array of { id, correctOption }
  const [userAnswers, setUserAnswers] = useState({}); // Object: { "question1": selectedOption, ... }
  const [result, setResult] = useState({
    correct: 0,
    incorrect: 0,
    unanswered: 0,
  });
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes and set user email; redirect if no user.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser.email);
        console.log("User email:", firebaseUser.email);
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;

      try {
        // Fetch correct answers from Firestore
        const questionSnapshot = await firestore
          .collection('tests')
          .doc(testID)
          .collection('questions')
          .get();

        const questions = [];
        questionSnapshot.forEach((doc) => {
          const data = doc.data();
          // Assume correctOption is stored as a number (0-indexed)
          questions.push({
            id: doc.id, // Assumes IDs like "question1", "question2", etc.
            correctOption: data.correctOption,
          });
        });
        setCorrectAnswers(questions);

        // Fetch user's answers from Firestore
        const userAnswerSnapshot = await firestore
          .collection('userAnswers')
          .doc(user)
          .collection(testID)
          .get();

        const answers = {};
        userAnswerSnapshot.forEach((doc) => {
          const data = doc.data();
          // Assume data.selectedOption is stored as 1-indexed (e.g., 1, 2, 3, 4)
          answers[doc.id] = data.selectedOption;
        });
        setUserAnswers(answers);

        // Evaluate results: for each question, compare user's answer to correct answer.
       let correct = 0;
let incorrect = 0;
let unanswered = 0;
let totalScore = 0;

questions.forEach((q, idx) => {
  const questionKey = `question${idx + 1}`;
  const userAnswer = answers[questionKey];

  if (userAnswer == null || userAnswer === "") {
    unanswered++;
    totalScore += 0;
  } else if (Number(userAnswer) - 1 === Number(q.correctOption)) {
    correct++;
    totalScore += 4; // JEE Mains correct answer
  } else {
    incorrect++;
    totalScore -= 1; // JEE Mains negative marking
  }
});

        setResult({ correct, incorrect, unanswered, totalScore });



        // Save result to Firestore under /results/{user}/{testID}/result
        const resultRef = firestore
          .collection('results')
          .doc(user)
          .collection(testID)
          .doc('result');

        await resultRef.set({ correct, incorrect, unanswered, totalScore });
        console.log('Result saved successfully');

        setLoading(false);
      } catch (error) {
        console.error('Error fetching result:', error);
        setLoading(false);
      }
    };

    fetchResults();
  }, [user, testID]);

  if (loading || !user) return <div>Loading Result...</div>;

  return (
    <div className="result">
     <>
      <header className="jee-header">
        <div className="jee-container jee-header-content">
          <h1 className="jee-header-title">JEE Main 2025 Results</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="jee-container jee-main-content">
        {/* Individual Student Result Section */}
        <section className="jee-your-result-section">
          <h2 className="jee-section-title">Your Result</h2>
          <div className="jee-your-result-details">
            {/* Large Circle for Total Score */}
            <div className="jee-score-circle">
              <p className="jee-score-value">{result.totalScore}</p>
              <p className="jee-score-total">/ {300}</p>
            </div>

            <div className="jee-result-summary">
              <p className="jee-result-text">
                <span className="jee-result-label">Overall Rank:</span>{' '}
                <span className="jee-result-rank">{123}</span>
              </p>
              <p className="jee-result-text">
                <span className="jee-result-label">Status:</span>{' '}
                <span className={`jee-status-badge ${true ? 'jee-status-qualified' : 'jee-status-not-qualified'}`}>
                  {'Qualified for JEE Advanced'}
                </span>
              </p>
            </div>
          </div>

          <div className="jee-subject-scores-container">
            <h3 className="jee-subject-scores-title">Subject-wise Scores:</h3>
            <div className="jee-subject-cards-grid">
              {[
                { name: 'Physics', score: 95, maxScore: 100, percentage: 95.00, colorClass: 'jee-physics-card' },
                { name: 'Chemistry', score: 90, maxScore: 100, percentage: 90.00, colorClass: 'jee-chemistry-card' },
                { name: 'Mathematics', score: 100, maxScore: 100, percentage: 100.00, colorClass: 'jee-mathematics-card' },
              ].map((subject, index) => (
                <div key={index} className={`jee-subject-card ${subject.colorClass}`}>
                  <div>
                    <p className="jee-subject-name">{subject.name}</p>
                    <p className="jee-subject-score">
                      {subject.score} <span className="jee-subject-score-total">/ {subject.maxScore}</span>
                    </p>
                  </div>
                  <p className="jee-subject-percentage">
                    Percentage: <span className="jee-font-semibold">{subject.percentage.toFixed(2)}%</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scoreboard Section */}
        <section className="jee-scoreboard-section">
          <h2 className="jee-section-title">Top Performers Scoreboard</h2>

          <div className="jee-scoreboard-table-wrapper">
            <table className="jee-scoreboard-table">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Roll Number</th>
                  <th scope="col">Name</th>
                  <th scope="col">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: 1, rollNumber: 'JEE2025-000001', name: 'Alice Smith', totalScore: 298 },
                  { rank: 2, rollNumber: 'JEE2025-000002', name: 'Bob Johnson', totalScore: 295 },,
                ].map((performer) => (
                  <tr key={performer.rank}>
                    <td>{performer.rank}</td>
                    <td>{performer.rollNumber}</td>
                    <td>{performer.name}</td>
                    <td>{performer.totalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="jee-footer">
        <p>&copy; 2025 JEE Main Results. All rights reserved.</p>
      </footer>
    </>
    </div>
  );
};

export default ResultPage;
