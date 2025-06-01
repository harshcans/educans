import React from 'react';

const TestDetails = ({ option }) => {
  let totalMarks, totalTime, totalQuestions, subjects, sections;

  switch (option) {
    case 'jeemains':
      totalMarks = 300;
      totalTime = '180 minutes';
      totalQuestions = 90;
      subjects = ['Mathematics', 'Physics', 'Chemistry'];
      sections = [
        { sectionNumber: 1, questionType: 'MCQs', totalQuestions: 20, optionalQuestions: 0 },
        { sectionNumber: 2, questionType: 'Integer Type', totalQuestions: 10, optionalQuestions: 5 }
      ];
    default:
      totalMarks = 0;
      totalTime = '';
      totalQuestions = 0;
      subjects = [];
      sections = [];
  }
  // const sectionOne = sections.find(section => section.sectionNumber === 2);

  return (
    <div>
      <h2>Test Details</h2>
      <p>Total Marks: {totalMarks}</p>
      <p>Total Time: {totalTime}</p>
      <p>Total Questions: {totalQuestions}</p>
      <p>Subjects: {subjects.join(', ')}</p>
      {/* <p>Section Number: {sectionOne.sectionNumber}</p> */}
      <ul>
        {sections.map((section, index) => (
          <li key={index}>
            Section {section.sectionNumber}: {section.questionType} - {section.totalQuestions} questions, {section.optionalQuestions} optional
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestDetails;
