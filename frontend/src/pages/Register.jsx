import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Simple validation functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
 
  //password logic
  const isValidPassword = (password) => {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false; // At least 1 uppercase
    if (!/[0-9]/.test(password)) return false; // At least 1 digit
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false; // At least 1 special char
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!isValidPassword(form.password)) {
      setError("Password must have 8+ characters, 1 uppercase, 1 digit, 1 special character");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      // Registration successful, redirect to login
      navigate("/login");
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
          <h2>🎓 Start Learning Today</h2>
          <div className="sticker-row">
            <span className="sticker">📚</span>
            <span className="sticker">✏️</span>
            <span className="sticker">🎯</span>
            <span className="sticker">⭐</span>
          </div>
          <ul className="features-list">
            <li>Create account in seconds</li>
            <li>Choose your role and get started</li>
            <li>Access thousands of exams</li>
            <li>Track your learning progress</li>
            <li>Get instant feedback on answers</li>
          </ul>
        </div>

        <div className="auth-right">
          <div className="auth-box">
            <div className="auth-header">
              <h1>📝 Create Account</h1>
              <p className="auth-subtitle">Join us and get started</p>
            </div>

            {error && <div className="error-message">❌ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>👤 Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label>📧 Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
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
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password (minimum 8 characters)"
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

              <div className="form-group">
                <label>🔒 Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label>🎯 Account Type</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="STUDENT">👨‍🎓 Student</option>
                  <option value="INSTRUCTOR">👨‍🏫 Instructor</option>
                  <option value="ADMIN">⚙️ Admin</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "🔄 Creating..." : "✨ Sign Up"}
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have account? <Link to="/login">Login here</Link> 👋</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
