/**
 * Course & Content Management API Service
 * Handles all CRUD operations for courses, subjects, topics, and materials
 */

import { generatePdfFromText, downloadFileAsPdf } from '../utils/pdfGenerator';

const API_URL = "http://localhost:8080/api";

const getAuthToken = () => {
  const token = localStorage.getItem("authToken") || localStorage.getItem("token");
  console.log("[AUTH] Token retrieved:", token ? "Yes" : "No");
  return token;
};

const authFetch = async (url, opts = {}) => {
  const headers = { "Content-Type": "application/json", ...opts.headers };
  const token = getAuthToken();
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  console.log("[FETCH] URL:", url);
  console.log("[FETCH] Headers:", { ...headers, Authorization: headers.Authorization ? "***" : "none" });
  
  try {
    const response = await fetch(url, { ...opts, headers });
    console.log("[RESPONSE] Status:", response.status, response.statusText);
    
    // Try to get response body for error messages
    let body = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      body = await response.json();
    } else {
      body = await response.text();
    }
    
    if (!response.ok) {
      const errorMsg = body?.message || body?.error || "Request failed";
      console.error("[ERROR]", response.status, errorMsg);
      throw new Error(errorMsg);
    }
    
    return { ok: true, json: async () => body, status: response.status };
  } catch (error) {
    console.error("[FETCH ERROR]", error);
    throw error;
  }
};

// ==================== COURSE API ====================
export const courseAPI = {
  // Get all courses for instructor
  getAll: async () => {
    console.log("[API] GET /courses");
    try {
      const response = await authFetch(`${API_URL}/courses`);
      const data = await response.json();
      console.log("[API] Courses fetched:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("[API ERROR] Failed to fetch courses:", error.message);
      // Return empty array on error so UI doesn't break
      return [];
    }
  },

  // Get single course
  getById: async (id) => {
    console.log("[API] GET /courses/:id", id);
    try {
      const response = await authFetch(`${API_URL}/courses/${id}`);
      return await response.json();
    } catch (error) {
      console.error("[API ERROR] Failed to fetch course:", error.message);
      throw error;
    }
  },

  // Create new course
  create: async (courseData) => {
    console.log("[API] POST /courses", courseData);
    try {
      const response = await authFetch(`${API_URL}/courses`, {
        method: "POST",
        body: JSON.stringify(courseData),
      });
      const data = await response.json();
      console.log("[API] Course created:", data);
      return data;
    } catch (error) {
      console.error("[API ERROR] Failed to create course:", error.message);
      throw new Error(error.message || "Failed to create course");
    }
  },

  // Update course
  update: async (id, courseData) => {
    console.log("[API] PUT /courses/:id", id, courseData);
    try {
      const response = await authFetch(`${API_URL}/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(courseData),
      });
      return await response.json();
    } catch (error) {
      console.error("[API ERROR] Failed to update course:", error.message);
      throw error;
    }
  },

  // Delete course
  delete: async (id) => {
    console.log("[API] DELETE /courses/:id", id);
    try {
      const response = await authFetch(`${API_URL}/courses/${id}`, {
        method: "DELETE",
      });
      return await response.json();
    } catch (error) {
      console.error("[API ERROR] Failed to delete course:", error.message);
      throw error;
    }
  },
};

// ==================== SUBJECT API ====================
export const subjectAPI = {
  // Get all subjects for a course
  getByCourse: async (courseId) => {
    console.log("[API] GET /courses/:id/subjects", courseId);
    try {
      const response = await authFetch(`${API_URL}/courses/${courseId}/subjects`);
      const data = await response.json();
      console.log("[API] Subjects fetched:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("[API ERROR] Failed to fetch subjects:", error.message);
      return [];
    }
  },

  // Create new subject
  create: async (courseId, subjectData) => {
    console.log("[API] POST /courses/:id/subjects", courseId, subjectData);
    try {
      const response = await authFetch(`${API_URL}/courses/${courseId}/subjects`, {
        method: "POST",
        body: JSON.stringify(subjectData),
      });
      const data = await response.json();
      console.log("[API] Subject created:", data);
      return data;
    } catch (error) {
      console.error("[API ERROR] Failed to create subject:", error.message);
      throw new Error(error.message || "Failed to create subject");
    }
  },

  // Update subject
  update: async (courseId, subjectId, subjectData) => {
    console.log("[API] PUT /courses/:id/subjects/:id", courseId, subjectId, subjectData);
    try {
      const response = await authFetch(
        `${API_URL}/courses/${courseId}/subjects/${subjectId}`,
        {
          method: "PUT",
          body: JSON.stringify(subjectData),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("[API ERROR] Failed to update subject:", error.message);
      throw error;
    }
  },

  // Delete subject
  delete: async (courseId, subjectId) => {
    console.log("[API] DELETE /courses/:id/subjects/:id", courseId, subjectId);
    try {
      const response = await authFetch(
        `${API_URL}/courses/${courseId}/subjects/${subjectId}`,
        { method: "DELETE" }
      );
      return await response.json();
    } catch (error) {
      console.error("[API ERROR] Failed to delete subject:", error.message);
      throw error;
    }
  },
};

// ==================== TOPIC API ====================
export const topicAPI = {
  // Get all topics for a subject
  getBySubject: async (courseId, subjectId) => {
    console.log("[API] GET /courses/:id/subjects/:id/topics", courseId, subjectId);
    try {
      const response = await authFetch(
        `${API_URL}/courses/${courseId}/subjects/${subjectId}/topics`
      );
      const data = await response.json();
      console.log("[API] Topics fetched:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("[API ERROR] Failed to fetch topics:", error.message);
      return [];
    }
  },

  // Create new topic
  create: async (courseId, subjectId, topicData) => {
    console.log("[API] POST /topics", topicData);
    try {
      const response = await authFetch(`${API_URL}/topics`, {
        method: "POST",
        body: JSON.stringify({
          ...topicData,
          subjectId,
        }),
      });
      const data = await response.json();
      console.log("[API] Topic created:", data);
      return data;
    } catch (error) {
      console.error("[API ERROR] Failed to create topic:", error.message);
      throw new Error(error.message || "Failed to create topic");
    }
  },

  // Update topic
  update: async (topicId, topicData) => {
    console.log("[API] PUT /topics/:id", topicId, topicData);
    try {
      const response = await authFetch(`${API_URL}/topics/${topicId}`, {
        method: "PUT",
        body: JSON.stringify(topicData),
      });
      return await response.json();
    } catch (error) {
      console.error("[API ERROR] Failed to update topic:", error.message);
      throw error;
    }
  },

  // Delete topic
  delete: async (topicId) => {
    console.log("[API] DELETE /topics/:id", topicId);
    try {
      const response = await authFetch(`${API_URL}/topics/${topicId}`, {
        method: "DELETE",
      });
      return await response.json();
    } catch (error) {
      console.error("[API ERROR] Failed to delete topic:", error.message);
      throw error;
    }
  },
};

// ==================== MATERIAL API ====================
export const materialAPI = {
  // Get all materials for a topic
  getByTopic: async (topicId) => {
    console.log("[API] GET /topics/:id/materials", topicId);
    try {
      const response = await authFetch(`${API_URL}/topics/${topicId}/materials`);
      const data = await response.json();
      console.log("[API] Materials fetched:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("[API ERROR] Failed to fetch materials:", error.message);
      return [];
    }
  },

  // Create new material
  create: async (topicId, materialData) => {
    console.log("[API] POST /materials", materialData);
    try {
      const response = await authFetch(`${API_URL}/materials`, {
        method: "POST",
        body: JSON.stringify({
          ...materialData,
          topicId,
        }),
      });
      const data = await response.json();
      console.log("[API] Material created:", data);
      return data;
    } catch (error) {
      console.error("[API ERROR] Failed to create material:", error.message);
      throw new Error(error.message || "Failed to create material");
    }
  },

  // Update material
  update: async (materialId, materialData) => {
    console.log("[API] PUT /materials/:id", materialId, materialData);
    try {
      const response = await authFetch(`${API_URL}/materials/${materialId}`, {
        method: "PUT",
        body: JSON.stringify(materialData),
      });
      const data = await response.json();
      console.log("[API] Material updated:", data);
      return data;
    } catch (error) {
      console.error("[API ERROR] Failed to update material:", error.message);
      throw error;
    }
  },

  // Delete material
  delete: async (materialId) => {
    console.log("[API] DELETE /materials/:id", materialId);
    try {
      const response = await authFetch(`${API_URL}/materials/${materialId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log("[API] Material deleted:", data);
      return data;
    } catch (error) {
      console.error("[API ERROR] Failed to delete material:", error.message);
      throw error;
    }
  },

  // Upload file
  uploadFile: async (file, topicId, fileName) => {
    console.log("[API] POST /materials/upload", topicId, fileName);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("topicId", topicId);
      formData.append("fileName", fileName);

      const token = getAuthToken();
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/materials/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload file");
      }

      const data = await response.json();
      console.log("[API] File uploaded successfully:", data);
      return data;
    } catch (error) {
      console.error("[API ERROR] Failed to upload file:", error.message);
      throw new Error(error.message || "Failed to upload file");
    }
  },

  // Download file with proper format preservation
  downloadFile: async (fileUrl, fileName = "download") => {
    console.log("[API] Downloading file from:", fileUrl);
    try {
      // Extract the actual filename from the URL path
      let actualFileName = fileName;
      
      // Get filename from URL path (e.g., /uploads/materials/1234567890_originalname.pdf)
      const urlPath = fileUrl.split("?")[0]; // Remove query params
      const fileNameFromUrl = urlPath.split("/").pop(); // Get last part of path
      
      if (fileNameFromUrl && fileNameFromUrl.length > 0) {
        actualFileName = decodeURIComponent(fileNameFromUrl);
      }
      
      console.log("[API] Extracted filename from URL:", actualFileName);
      
      const token = getAuthToken();
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Construct full URL if relative path provided
      let fullUrl = fileUrl;
      if (fileUrl.startsWith("/")) {
        fullUrl = "http://localhost:8080" + fileUrl;
      }
      
      console.log("[API] Full download URL:", fullUrl);

      // Make request to the actual file URL
      const response = await fetch(fullUrl, { 
        headers,
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText} (${response.status})`);
      }

      const blob = await response.blob();
      
      // Verify we got some content
      if (blob.size === 0) {
        throw new Error("Downloaded file is empty");
      }
      
      console.log("[API] Downloaded blob size:", blob.size, "bytes");
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = actualFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log("[API] File downloaded successfully as:", actualFileName);
    } catch (error) {
      console.error("[API ERROR] Failed to download file:", error.message);
      throw new Error(error.message || "Failed to download file");
    }
  },

  // Download file as PDF
  downloadFileAsPdf: async (fileUrl, fileName = "document") => {
    console.log("[API] Downloading file as PDF from:", fileUrl);
    try {
      await downloadFileAsPdf(fileUrl, fileName);
      console.log("[API] File downloaded as PDF:", fileName);
    } catch (error) {
      console.error("[API ERROR] Failed to download file as PDF:", error.message);
      throw error;
    }
  },

  // Generate PDF from text content
  generatePdfFromText: (textContent, title = "", fileName = "document") => {
    console.log("[API] Generating PDF from text:", fileName);
    try {
      generatePdfFromText(textContent, title, fileName);
      console.log("[API] PDF generated successfully:", fileName);
    } catch (error) {
      console.error("[API ERROR] Failed to generate PDF from text:", error.message);
      throw error;
    }
  },
};

// ==================== DEBUG HELPER ====================
export const debugAPI = {
  // Check API connection
  checkConnection: async () => {
    console.log("[DEBUG] Checking API connection to", API_URL);
    try {
      const response = await fetch(`${API_URL}/courses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("[DEBUG] API Response Status:", response.status);
      console.log("[DEBUG] API is", response.ok ? "REACHABLE" : "NOT OK");
      const data = await response.text();
      console.log("[DEBUG] API Response Body:", data);
      return { status: response.status, ok: response.ok, data };
    } catch (error) {
      console.error("[DEBUG] API Connection Error:", error);
      return { error: error.message };
    }
  },

  // Check token
  checkToken: () => {
    const token = getAuthToken();
    console.log("[DEBUG] Token Status:", token ? "✓ EXISTS" : "✗ NOT FOUND");
    console.log("[DEBUG] authToken:", localStorage.getItem("authToken") ? "EXISTS" : "NOT FOUND");
    console.log("[DEBUG] token:", localStorage.getItem("token") ? "EXISTS" : "NOT FOUND");
    return {
      token,
      authTokenKey: localStorage.getItem("authToken"),
      tokenKey: localStorage.getItem("token"),
    };
  },

  // Check all localStorage
  checkStorage: () => {
    console.log("[DEBUG] Full localStorage:");
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      items[key] = localStorage.getItem(key)?.substring(0, 50) + "...";
    }
    console.log(items);
    return items;
  },
};
