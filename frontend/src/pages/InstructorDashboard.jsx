import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function InstructorDashboard({ user }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Instructor Dashboard</h1>
        <p>Welcome back, {user?.name || "Instructor"}!</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">📚</div>
          <h3 className="card-title">Course Management</h3>
          <p className="card-description">Create and manage courses, subjects, topics, and materials</p>
          <button className="action-button primary" onClick={() => navigate("/instructor/courses")}>
            Open Courses
          </button>
        </div>
      </div>
    </div>
  );
}
