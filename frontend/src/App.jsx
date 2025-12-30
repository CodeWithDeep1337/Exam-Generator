import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import CourseManagement from "./pages/CourseManagement";
import Navigation from "./components/Navigation";
import { authAPI } from "./services/api";
import { ROUTES, getDashboardURL, isAuthorized } from "./config/routes";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Verify token with backend
    fetch("http://localhost:8080/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // ProtectedRoute component - ensures user is authenticated and authorized
  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (!user) return <Navigate to={ROUTES.PUBLIC.LOGIN} replace />;
    if (!isAuthorized(user.role, allowedRoles)) return <Navigate to={ROUTES.HOME} replace />;
    return element;
  };

  return (
    <BrowserRouter>
      {user && <Navigation user={user} onLogout={() => setUser(null)} />}
      <Routes>
        {/* ============ Public Routes ============ */}
        <Route 
          path={ROUTES.PUBLIC.LOGIN} 
          element={user ? <Navigate to={ROUTES.HOME} replace /> : <Login onLoginSuccess={setUser} />} 
        />
        <Route 
          path={ROUTES.PUBLIC.REGISTER} 
          element={user ? <Navigate to={ROUTES.HOME} replace /> : <Register />} 
        />

        {/* ============ Student Routes ============ */}
        <Route 
          path={ROUTES.DASHBOARD.STUDENT} 
          element={<ProtectedRoute element={<StudentDashboard user={user} />} allowedRoles={["STUDENT"]} />} 
        />

        {/* ============ Admin Routes ============ */}
        <Route 
          path={ROUTES.DASHBOARD.ADMIN} 
          element={<ProtectedRoute element={<AdminDashboard user={user} />} allowedRoles={["ADMIN"]} />} 
        />

        {/* ============ Instructor Routes ============ */}
        <Route 
          path={ROUTES.DASHBOARD.INSTRUCTOR} 
          element={<ProtectedRoute element={<InstructorDashboard user={user} />} allowedRoles={["INSTRUCTOR"]} />} 
        />
        <Route 
          path={ROUTES.INSTRUCTOR.COURSES} 
          element={<ProtectedRoute element={<CourseManagement />} allowedRoles={["INSTRUCTOR"]} />} 
        />
        <Route 
          path={ROUTES.INSTRUCTOR.COURSE_VIEW} 
          element={<ProtectedRoute element={<CourseManagement />} allowedRoles={["INSTRUCTOR"]} />} 
        />
        <Route 
          path={ROUTES.INSTRUCTOR.SUBJECT_VIEW} 
          element={<ProtectedRoute element={<CourseManagement />} allowedRoles={["INSTRUCTOR"]} />} 
        />
        <Route 
          path={ROUTES.INSTRUCTOR.TOPIC_VIEW} 
          element={<ProtectedRoute element={<CourseManagement />} allowedRoles={["INSTRUCTOR"]} />} 
        />

        {/* ============ Root Route ============ */}
        <Route 
          path={ROUTES.HOME} 
          element={
            user ? (
              <Navigate to={getDashboardURL(user.role)} replace />
            ) : (
              <Navigate to={ROUTES.PUBLIC.LOGIN} replace />
            )
          } 
        />

        {/* ============ 404 - Not Found ============ */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;