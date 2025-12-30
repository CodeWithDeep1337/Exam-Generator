import "../styles/Dashboard.css";

export default function AdminDashboard({ user }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Panel</h1>
        <p>Welcome, {user?.name}</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">👥</div>
          <h3>Manage Users</h3>
          <p>Add, edit, or remove user accounts</p>
          <button className="btn-primary">Manage Users</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📋</div>
          <h3>Manage Exams</h3>
          <p>Create and edit exams</p>
          <button className="btn-primary">Manage Exams</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>View Reports</h3>
          <p>Check detailed analytics and reports</p>
          <button className="btn-secondary">View Reports</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">⚙️</div>
          <h3>Settings</h3>
          <p>Configure system settings</p>
          <button className="btn-secondary">Settings</button>
        </div>
      </div>
    </div>
  );
}
