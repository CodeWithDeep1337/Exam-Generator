import { useState, useEffect } from 'react';
import './AdminPanel.css';

export default function AdminPanel({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    activeStudents: 0,
    completedExams: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setStats({
        totalUsers: 150,
        totalExams: 42,
        activeStudents: 89,
        completedExams: 234
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      console.log('Delete user:', id);
    }
  };

  const handleDeleteExam = (id) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      console.log('Delete exam:', id);
    }
  };

  // Mock data
  const users = [];
  const exams = [];
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-icon">⚙️</span>
          <span className="logo-text">Admin Panel</span>
        </div>
        <nav className="[]-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon">👥</span>
            <span>Users</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            <span className="nav-icon">📝</span>
            <span>Exams</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </button>
          <button
            className="nav-item logout"
            onClick={onLogout}
          >
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div className="header-title">
            <h1>
              {activeTab === 'dashboard' && '📊 Dashboard'}
              {activeTab === 'users' && '👥 User Management'}
              {activeTab === 'exams' && '📝 Exam Management'}
              {activeTab === 'settings' && '⚙️ Settings'}
            </h1>
            <p className="header-subtitle">Welcome, {user?.name || 'Admin'}</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary">
              {activeTab === 'users' && '➕ Add User'}
              {activeTab === 'exams' && '➕ Create Exam'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>Total Users</h3>
                  <p className="stat-value">{stats.totalUsers}</p>
                  <p className="stat-change">+12% from last month</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <h3>Total Exams</h3>
                  <p className="stat-value">{stats.totalExams}</p>
                  <p className="stat-change">+5 new exams</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Active Students</h3>
                  <p className="stat-value">{stats.activeStudents}</p>
                  <p className="stat-change">Currently online</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <h3>Completed Exams</h3>
                  <p className="stat-value">{stats.completedExams}</p>
                  <p className="stat-change">This month</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                  <button className="action-btn">
                    <span className="action-icon">🧪</span>
                    <span>Create Exam</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">📊</span>
                    <span>View Reports</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">📧</span>
                    <span>Send Announcement</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">🔍</span>
                    <span>View Audit Logs</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-icon">➕</span>
                    <span className="activity-text">New user registered: John Doe</span>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">📝</span>
                    <span className="activity-text">Exam created: Mathematics 101</span>
                    <span className="activity-time">5 hours ago</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">✅</span>
                    <span className="activity-text">123 students completed Physics Basics</span>
                    <span className="activity-time">1 day ago</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">🔧</span>
                    <span className="activity-text">System maintenance completed</span>
                    <span className="activity-time">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <input
                  type="text"
                  placeholder="🔍 Search users by name or email..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn-primary">➕ Add User</button>
              </div>
              <div className="users-table-wrapper">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className={`status-${user.status.toLowerCase()}`}>
                        <td className="user-name">
                          <span className="user-avatar">{user.name[0]}</span>
                          {user.name}
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge role-${user.role.toLowerCase()}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${user.status.toLowerCase()}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button className="action-edit">✏️</button>
                          <button
                            className="action-delete"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="exams-section">
              <div className="section-header">
                <input
                  type="text"
                  placeholder="🔍 Search exams..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn-primary">➕ Create Exam</button>
              </div>
              <div className="exams-grid">
                {filteredExams.map((exam) => (
                  <div key={exam.id} className="exam-card">
                    <div className="exam-header">
                      <h3>{exam.title}</h3>
                      <span className={`exam-status status-${exam.status.toLowerCase()}`}>
                        {exam.status}
                      </span>
                    </div>
                    <p className="exam-creator">👤 {exam.creator}</p>
                    <div className="exam-stats">
                      <div className="stat">
                        <span className="icon">❓</span>
                        <span>{exam.questions} Questions</span>
                      </div>
                      <div className="stat">
                        <span className="icon">👥</span>
                        <span>{exam.students} Students</span>
                      </div>
                    </div>
                    <div className="exam-actions">
                      <button className="btn-small btn-edit">✏️ Edit</button>
                      <button className="btn-small btn-view">👁️ View</button>
                      <button
                        className="btn-small btn-delete"
                        onClick={() => handleDeleteExam(exam.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="settings-card">
                <h3>General Settings</h3>
                <div className="setting-item">
                  <label>Platform Name</label>
                  <input type="text" defaultValue="Smart AI Exam Generator" />
                </div>
                <div className="setting-item">
                  <label>Support Email</label>
                  <input type="email" defaultValue="support@examgenerator.com" />
                </div>
                <div className="setting-item">
                  <label>Max Exam Duration (minutes)</label>
                  <input type="number" defaultValue="120" />
                </div>
              </div>

              <div className="settings-card">
                <h3>Security Settings</h3>
                <div className="setting-item">
                  <label>Enable 2FA</label>
                  <input type="checkbox" defaultChecked={false} />
                </div>
                <div className="setting-item">
                  <label>Session Timeout (minutes)</label>
                  <input type="number" defaultValue="30" />
                </div>
                <div className="setting-item">
                  <label>Password Expiry (days)</label>
                  <input type="number" defaultValue="90" />
                </div>
              </div>

              <div className="settings-card">
                <h3>Email Notifications</h3>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked={true} />
                    Notify on new exam results
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked={true} />
                    Notify on user registration
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked={false} />
                    Daily summary email
                  </label>
                </div>
              </div>

              <div className="settings-actions">
                <button className="btn-primary">💾 Save Changes</button>
                <button className="btn-secondary">🔄 Reset to Default</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
