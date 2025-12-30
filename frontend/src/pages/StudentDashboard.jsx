import "../styles/Dashboard.css";

export default function StudentDashboard({ user }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Your student dashboard</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">📝</div>
          <h3>Take Exam</h3>
          <p>Start a new exam and test your knowledge</p>
          <button className="btn-primary">Start Exam</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>My Results</h3>
          <p>View your exam scores and performance</p>
          <button className="btn-secondary">View Results</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📚</div>
          <h3>Study Materials</h3>
          <p>Access learning resources and guides</p>
          <button className="btn-secondary">Browse</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📈</div>
          <h3>Progress</h3>
          <p>Track your learning progress over time</p>
          <button className="btn-secondary">View Progress</button>
        </div>
      </div>
    </div>
  );
}
