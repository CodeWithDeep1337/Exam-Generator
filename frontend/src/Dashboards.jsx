import './Dashboards.css';

export default function Dashboards({ user }) {
  if (!user) return null;

  const getDashboardIcon = (role) => {
    const icons = {
      STUDENT: '📚',
      INSTRUCTOR: '👨‍🏫',
      ADMIN: '⚙️'
    };
    return icons[role] || '👤';
  };

  const renderStudentDashboard = () => (
    <>
      <div className="dashboard-card">
        <div className="card-icon student">📝</div>
        <h3 className="card-title">Take Exams</h3>
        <p className="card-description">Attempt AI-generated exams and track your progress</p>
        <div className="card-actions">
          <button className="action-button primary">Start Exam</button>
          <button className="action-button secondary">View Results</button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-icon student">📊</div>
        <h3 className="card-title">Your Performance</h3>
        <p className="card-description">View detailed analytics and improvement areas</p>
        <ul className="feature-list">
          <li>Track your scores</li>
          <li>Identify weak areas</li>
          <li>Compare performance</li>
        </ul>
      </div>

      <div className="dashboard-card">
        <div className="card-icon student">🎓</div>
        <h3 className="card-title">Learning Resources</h3>
        <p className="card-description">Access study materials and learning guides</p>
        <div className="card-actions">
          <button className="action-button secondary">Browse Resources</button>
        </div>
      </div>
    </>
  );

  const renderInstructorDashboard = () => (
    <>
      <div className="dashboard-card">
        <div className="card-icon instructor">✨</div>
        <h3 className="card-title">Generate Exams</h3>
        <p className="card-description">Create AI-powered exams instantly from your syllabus</p>
        <div className="card-actions">
          <button className="action-button primary">Create New Exam</button>
          <button className="action-button secondary">View Templates</button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-icon instructor">📁</div>
        <h3 className="card-title">Course Management</h3>
        <p className="card-description">Upload courses and manage exam materials</p>
        <div className="card-actions">
          <button className="action-button primary">Upload Course</button>
          <button className="action-button secondary">Manage Courses</button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-icon instructor">👥</div>
        <h3 className="card-title">Student Analytics</h3>
        <p className="card-description">Monitor student performance and engagement</p>
        <div className="card-actions">
          <button className="action-button secondary">View Analytics</button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-icon instructor">⚡</div>
        <h3 className="card-title">Smart Features</h3>
        <p className="card-description">Use AI-powered tools to enhance assessment</p>
        <ul className="feature-list">
          <li>Auto-generate questions</li>
          <li>Adaptive difficulty</li>
          <li>Instant grading</li>
        </ul>
      </div>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <div className="dashboard-card">
        <div className="card-icon admin">👥</div>
        <h3 className="card-title">User Management</h3>
        <p className="card-description">Manage all users and their permissions</p>
        <div className="card-actions">
          <button className="action-button primary">Manage Users</button>
          <button className="action-button secondary">View Roles</button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-icon admin">📊</div>
        <h3 className="card-title">System Analytics</h3>
        <p className="card-description">Monitor system performance and usage</p>
        <div className="card-actions">
          <button className="action-button secondary">View Reports</button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-icon admin">🔐</div>
        <h3 className="card-title">Security Settings</h3>
        <p className="card-description">Configure security policies and access control</p>
        <div className="card-actions">
          <button className="action-button secondary">Configure Security</button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-icon admin">⚙️</div>
        <h3 className="card-title">System Configuration</h3>
        <p className="card-description">Manage system settings and preferences</p>
        <ul className="feature-list">
          <li>API Configuration</li>
          <li>Email Settings</li>
          <li>Backup & Recovery</li>
        </ul>
      </div>
    </>
  );

  return (
    <div className="dash-container">
      <div className="dashboard-content">
        <div className="welcome-section">
          <div className="welcome-header">
            <div className="welcome-avatar">{getDashboardIcon(user.role)}</div>
            <div className="welcome-text">
              <h2>Welcome back, {user.name}!</h2>
              <p>Smart AI Exam Generator - {user.role} Dashboard</p>
            </div>
          </div>
          <p style={{ margin: '16px 0 0 0', color: '#666', fontSize: '14px' }}>
            {user.role === 'STUDENT' && 'Start by taking an exam or reviewing your past performance.'}
            {user.role === 'INSTRUCTOR' && 'Create intelligent exams powered by AI and manage your courses.'}
            {user.role === 'ADMIN' && 'Oversee the system and manage users and security settings.'}
          </p>
        </div>

        <div className="dashboard-grid">
          {user.role === 'STUDENT' && renderStudentDashboard()}
          {user.role === 'INSTRUCTOR' && renderInstructorDashboard()}
          {user.role === 'ADMIN' && renderAdminDashboard()}
        </div>
      </div>
    </div>
  );
}