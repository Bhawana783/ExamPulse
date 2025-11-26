import React, { useState } from "react";
import "./App.css"; // Make sure your CSS file is named App.css or change this to "./app.css"

// --- Mock Data ---
const MOCK_EXAMS = [
  {
    id: 1,
    name: "JEE Advanced 2025",
    category: "Competitive",
    date: "2025-05-26",
    deadline: "2025-04-10",
    eligibility: "Class 12 Pass",
    tags: ["Engineering", "Science"],
  },
  {
    id: 2,
    name: "NEET UG 2025",
    category: "Competitive",
    date: "2025-05-05",
    deadline: "2025-03-15",
    eligibility: "17+ Years",
    tags: ["Medical", "Biology"],
  },
  {
    id: 3,
    name: "UPSC Civil Services",
    category: "Government",
    date: "2025-06-15",
    deadline: "2025-02-28",
    eligibility: "Graduate",
    tags: ["Civil Services", "Govt"],
  },
  {
    id: 4,
    name: "CAT 2025",
    category: "Management",
    date: "2025-11-24",
    deadline: "2025-09-15",
    eligibility: "Graduate",
    tags: ["MBA", "Business"],
  },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, msg: "JEE Advanced application forms are out!", time: "2 hrs ago", type: "alert" },
  { id: 2, msg: "Reminder: NEET UG deadline ends in 2 days.", time: "5 hrs ago", type: "urgent" },
  { id: 3, msg: "New Syllabus update for UPSC 2025.", time: "1 day ago", type: "info" },
];

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }) => (
  <div className="sidebar">
    <div className="logo">
      <h2>Exam<span>Pulse</span></h2>
    </div>
    <nav>
      <button 
        className={activeTab === 'dashboard' ? 'active' : ''} 
        onClick={() => setActiveTab('dashboard')}>
        📊 Dashboard
      </button>
      <button 
        className={activeTab === 'exams' ? 'active' : ''} 
        onClick={() => setActiveTab('exams')}>
        📝 All Exams
      </button>
      <button 
        className={activeTab === 'notifications' ? 'active' : ''} 
        onClick={() => setActiveTab('notifications')}>
        🔔 Notifications <span className="badge pulse">3</span>
      </button>
      <button onClick={() => alert('Profile feature coming soon!')}>
        👤 Profile
      </button>
    </nav>
  </div>
);

const ExamCard = ({ exam }) => (
  <div className="exam-card">
    <div className="card-header">
      <span className="category-tag">{exam.category}</span>
      <span className="status-indicator">Open</span>
    </div>
    <h3>{exam.name}</h3>
    <div className="card-details">
      <p>📅 Exam: <strong>{exam.date}</strong></p>
      <p>⚠️ Deadline: <span className="text-orange">{exam.deadline}</span></p>
      <p>🎓 Elig: {exam.eligibility}</p>
    </div>
    <div className="card-actions">
      <button className="btn-outline">View Syllabus</button>
      <button className="btn-primary">Set Reminder</button>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="view-container">
    <header>
      <h1>Welcome back, Student! 👋</h1>
      <p>Stay in the pulse of your exam journey.</p>
    </header>
    
    <div className="stats-grid">
      <div className="stat-card">
        <h3>04</h3>
        <p>Upcoming Exams</p>
      </div>
      <div className="stat-card">
        <h3>02</h3>
        <p>Deadlines This Week</p>
      </div>
      <div className="stat-card highlight">
        <h3>85%</h3>
        <p>Profile Completion</p>
      </div>
    </div>

    <h2 className="section-title">Recommended for You</h2>
    <div className="exams-grid">
      {MOCK_EXAMS.slice(0, 2).map(exam => <ExamCard key={exam.id} exam={exam} />)}
    </div>
  </div>
);

const ExamList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredExams = MOCK_EXAMS.filter(exam => 
    exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="view-container">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search exams, categories..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn-primary">Search</button>
      </div>
      
      <div className="exams-grid">
        {filteredExams.map(exam => <ExamCard key={exam.id} exam={exam} />)}
      </div>
    </div>
  );
};

const Notifications = () => (
  <div className="view-container">
    <h2 className="section-title">Notifications</h2>
    <div className="notification-list">
      {MOCK_NOTIFICATIONS.map(notif => (
        <div key={notif.id} className={`notif-item ${notif.type}`}>
          <div className="notif-icon">
            {notif.type === 'urgent' ? '🔥' : notif.type === 'alert' ? '📢' : 'ℹ️'}
          </div>
          <div className="notif-content">
            <p>{notif.msg}</p>
            <span>{notif.time}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Main App Component ---

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'exams': return <ExamList />;
      case 'notifications': return <Notifications />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;