import { useState } from 'react';
import './LoginRegister.css';

const API = 'http://localhost:8080/auth';

export default function LoginRegister({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      setError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!form.password.trim()) {
      setError('Password is required');
      return false;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (!isLogin) {
      if (!form.name.trim()) {
        setError('Name is required');
        return false;
      }

      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const requestBody = isLogin
        ? { email: form.email, password: form.password }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role
          };

      const endpoint = isLogin ? 'login' : 'register';
      const res = await fetch(`${API}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.message || data.error || 'An error occurred';
        setError(errorMessage);
        return;
      }

      if (isLogin) {
        // Login successful - store token
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userRole', data.role || 'STUDENT');
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            onAuth && onAuth();
          }, 500);
        } else {
          setError('Login response missing token');
        }
      } else {
        // Registration successful
        setSuccess('Registration successful! Switching to login...');
        setTimeout(() => {
          setIsLogin(true);
          setForm({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'STUDENT'
          });
          setSuccess('');
        }, 1500);
      }
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to server. Make sure backend is running on http://localhost:8080');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'STUDENT'
    });
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      <div className="auth-content">
        <div className="auth-branding">
          <div className="brand-icon">🎓</div>
          <div className="brand-info">
            <h2 className="brand-title">Smart AI Exam Generator</h2>
            <p className="brand-tagline">Intelligent Assessment Platform</p>
          </div>
        </div>

        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-title">
              {isLogin ? 'Welcome Back' : 'Join Now'}
            </h1>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Access your intelligent exam platform' 
                : 'Create your account to get started'}
            </p>
          </div>

          <form onSubmit={submit} className="auth-form">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Select Role</label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {['STUDENT', 'INSTRUCTOR', 'ADMIN'].map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0) + r.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {isLogin ? 'Logging in...' : 'Creating Account...'}
              </>
            ) : isLogin ? (
              'Login'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-toggle-text">
            {isLogin
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              type="button"
              className="toggle-link"
              onClick={toggleAuthMode}
              disabled={loading}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}