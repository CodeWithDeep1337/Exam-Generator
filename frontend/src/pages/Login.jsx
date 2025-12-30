import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Simple email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role);

      // Update user state and navigate to correct dashboard
      onLoginSuccess(data);
      
      // Navigate to role-specific dashboard
      if (data.role === "ADMIN") {
        navigate("/dashboard/admin");
      } else if (data.role === "INSTRUCTOR") {
        navigate("/dashboard/instructor");
      } else {
        navigate("/dashboard/student");
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-left">
          <h2>🎓 Smart Exam Portal</h2>
          <div className="sticker-row">
            <span className="sticker">📚</span>
            <span className="sticker">✏️</span>
            <span className="sticker">🎯</span>
            <span className="sticker">⭐</span>
          </div>
          <ul className="features-list">
            <li>Secure authentication for all users</li>
            <li>Quick and easy login process</li>
            <li>Access thousands of exam questions</li>
            <li>Get instant results and feedback</li>
            <li>Track your learning progress</li>
          </ul>
        </div>

        <div className="auth-right">
          <div className="auth-box">
            <div className="auth-header">
              <h1>🔐 Welcome Back</h1>
              <p className="auth-subtitle">Login to your exam portal</p>
            </div>

            {error && <div className="error-message">❌ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>📧 Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label>🔑 Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="toggle-btn"
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "🔄 Logging in..." : "✨ Login Now"}
              </button>
            </form>

            <div className="auth-footer">
              <p>New here? <Link to="/register">Create an account</Link> 🚀</p>
            </div>

            <div className="features">
              <div className="feature-item">✅ Secure Authentication</div>
              <div className="feature-item">✅ Instant Feedback</div>
              <div className="feature-item">✅ Track Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
