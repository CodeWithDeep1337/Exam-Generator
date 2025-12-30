const API_URL = "http://localhost:8080/api";

// --- Auth helpers (JWT) ---
const getAuthToken = () => localStorage.getItem("authToken");
const setAuthToken = (token) => {
  if (token) localStorage.setItem("authToken", token);
  else localStorage.removeItem("authToken");
};

const authFetch = (url, opts = {}) => {
  const headers = opts.headers ? { ...opts.headers } : {};
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(url, { ...opts, headers });
};

export const authAPI = {
  register: async (data) => {
    console.log("[API] POST /auth/register", data);
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Failed to register");
    }
    return response.json();
  },

  login: async (credentials) => {
    console.log("[API] POST /auth/login", credentials);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Failed to login");
    }
    const body = await response.json();
    if (body.token) setAuthToken(body.token);
    return body;
  },

  logout: async () => {
    setAuthToken(null);
    return null;
  },

  getCurrentUser: async () => {
    console.log("[API] GET /auth/me");
    const response = await authFetch(`${API_URL}/auth/me`);
    if (!response.ok) throw new Error("Failed to fetch current user");
    return response.json();
  }
};
