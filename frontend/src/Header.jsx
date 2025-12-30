import { useState } from 'react';
import './Header.css';

export default function Header({ user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-logo">
            <span className="logo-icon">🎓</span>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Smart AI Exam Generator</h1>
            <p className="brand-subtitle">Intelligent Assessment Platform</p>
          </div>
        </div>

        {user && (
          <div className="header-user">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className={`user-role ${user.role.toLowerCase()}`}>
                {user.role}
              </span>
            </div>
            <div className="header-menu">
              <button 
                className="menu-toggle"
                onClick={() => setShowMenu(!showMenu)}
              >
                ⋮
              </button>
              {showMenu && (
                <div className="dropdown-menu">
                  <button className="dropdown-item">👤 Profile</button>
                  <button className="dropdown-item">⚙️ Settings</button>
                  <button className="dropdown-item">❓ Help</button>
                  <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid rgba(102, 126, 234, 0.2)' }} />
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('userRole');
                      onLogout();
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
