import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navigation.css";

export default function Navigation({ user, onLogout }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-logo">🎓</span>
          <span className="nav-title">Exam Generator</span>
        </div>

        <div className="nav-user">
          <span className="user-name">{user?.name}</span>
          <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
            ⋮
          </button>

          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => navigate(user.role === "ADMIN" ? "/admin" : "/student")}>
                📊 Dashboard
              </button>
              <button onClick={() => {}} className="disabled-btn">
                ⚙️ Settings
              </button>
              <button onClick={handleLogout} className="logout-btn">
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
