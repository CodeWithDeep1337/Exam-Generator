/**
 * Route Configuration
 * Centralized routing structure for the application
 */

export const ROUTES = {
  // Public Routes
  PUBLIC: {
    LOGIN: "/login",
    REGISTER: "/register",
  },

  // Dashboard Routes
  DASHBOARD: {
    ROOT: "/dashboard",
    STUDENT: "/dashboard/student",
    INSTRUCTOR: "/dashboard/instructor",
    ADMIN: "/dashboard/admin",
  },

  // Instructor Routes
  INSTRUCTOR: {
    COURSES: "/instructor/courses",
    COURSE_VIEW: "/instructor/courses/:courseId",
    SUBJECT_VIEW: "/instructor/courses/:courseId/subjects/:subjectId",
    TOPIC_VIEW: "/instructor/courses/:courseId/subjects/:subjectId/topics/:topicId",
  },

  // Root
  HOME: "/",
};

/**
 * Get role-specific dashboard URL
 */
export const getDashboardURL = (role) => {
  switch (role?.toUpperCase()) {
    case "STUDENT":
      return ROUTES.DASHBOARD.STUDENT;
    case "INSTRUCTOR":
      return ROUTES.DASHBOARD.INSTRUCTOR;
    case "ADMIN":
      return ROUTES.DASHBOARD.ADMIN;
    default:
      return ROUTES.HOME;
  }
};

/**
 * Check if user is authorized for a route
 */
export const isAuthorized = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole?.toUpperCase());
};
