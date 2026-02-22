// src/components/ExamCard.jsx
import "./ExamCard.css";

const ExamCard = ({ exam }) => (
  <div className="exam-card">
    <h3>{exam.ExamName}</h3>
    <p>Category: {exam.Category}</p>
    <p>Form Deadline: {exam.FormEndDate}</p>
    <a href={exam.OfficialLink} target="_blank" rel="noreferrer">Official Link</a>
  </div>
);

export default ExamCard;
