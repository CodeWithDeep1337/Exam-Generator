import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CourseManagement.css";
import { courseAPI, subjectAPI, topicAPI, materialAPI } from "../services/courseApi";
import CourseList from "../components/CourseList";
import SubjectList from "../components/SubjectList";
import TopicList from "../components/TopicList";
import CourseModal from "../components/CourseModal";
import SubjectModal from "../components/SubjectModal";
import TopicModal from "../components/TopicModal";
import MaterialModal from "../components/MaterialModal";
import { useAlert } from "../hooks/useAlert";
import { useMaterialForm } from "../hooks/useMaterialForm";
import { ROUTES } from "../config/routes";

// Helper function to convert YouTube URL to embed format
const convertYouTubeUrlToEmbed = (url) => {
  if (!url) return "";
  // Handle different YouTube URL formats
  let videoId = "";
  if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1]?.split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export default function CourseManagement() {
  const { alert, showAlert } = useAlert();
  const { materialForm, setMaterialForm, files, resetForm, handleFileSelect, removeFile } = useMaterialForm();
  const { courseId, subjectId, topicId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("courses");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  // Form states
  const [courseForm, setCourseForm] = useState({ title: "", description: "", difficulty: "BEGINNER" });
  const [subjectForm, setSubjectForm] = useState({ name: "", description: "" });
  const [topicForm, setTopicForm] = useState({ title: "", description: "" });

  // ============== EFFECTS ==============
  useEffect(() => {
    loadCourses();
  }, []);

  // Load selected course from URL params
  useEffect(() => {
    if (courseId && courses.length > 0) {
      const course = courses.find(c => c.id === parseInt(courseId));
      if (course) {
        setSelectedCourse(course);
        loadSubjects(course.id);
      }
    }
  }, [courseId, courses]);

  // Load selected subject from URL params
  useEffect(() => {
    if (subjectId && subjects.length > 0) {
      const subject = subjects.find(s => s.id === parseInt(subjectId));
      if (subject) {
        setSelectedSubject(subject);
        if (selectedCourse) loadTopics(subject.id);
      }
    }
  }, [subjectId, subjects]);

  // Load selected topic from URL params
  useEffect(() => {
    if (topicId && topics.length > 0) {
      const topic = topics.find(t => t.id === parseInt(topicId));
      if (topic) {
        setSelectedTopic(topic);
        loadMaterials(topic.id);
        setShowMaterialModal(true);
      }
    }
  }, [topicId, topics]);

  useEffect(() => {
    if (selectedSubject && selectedCourse) loadTopics(selectedSubject.id);
  }, [selectedSubject, selectedCourse]);

  // ============== API CALLS ==============
  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseAPI.getAll();
      setCourses(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      showAlert("❌ Failed to load courses", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async (courseId) => {
    try {
      const data = await subjectAPI.getByCourse(courseId);
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert("❌ Failed to load subjects", "error");
    }
  };

  const loadTopics = async (subjectId) => {
    try {
      if (selectedCourse) {
        const data = await topicAPI.getBySubject(selectedCourse.id, subjectId);
        const topicsWithCount = await Promise.all(
          data.map(async (topic) => {
            const topicMaterials = await materialAPI.getByTopic(topic.id);
            return { ...topic, materialCount: topicMaterials.length };
          })
        );
        setTopics(Array.isArray(topicsWithCount) ? topicsWithCount : []);
      }
    } catch (err) {
      showAlert("❌ Failed to load topics", "error");
    }
  };

  const loadMaterials = async (topicId) => {
    try {
      const data = await materialAPI.getByTopic(topicId);
      setMaterials(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert("❌ Failed to load materials", "error");
    }
  };

  // ============== COURSE HANDLERS ==============
  const handleCreateCourse = async () => {
    try {
      setLoading(true);
      await courseAPI.create(courseForm);
      showAlert("✅ Course created successfully!", "success");
      setCourseForm({ title: "", description: "", difficulty: "BEGINNER" });
      setShowCourseModal(false);
      loadCourses();
    } catch (err) {
      showAlert("❌ " + (err.message || "Failed to create course"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async () => {
    try {
      setLoading(true);
      await courseAPI.update(editingItem.id, courseForm);
      showAlert("✅ Course updated successfully!", "success");
      setCourseForm({ title: "", description: "", difficulty: "BEGINNER" });
      setShowCourseModal(false);
      setEditingItem(null);
      loadCourses();
    } catch (err) {
      showAlert("❌ " + (err.message || "Failed to update course"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course? All subjects and topics will be deleted.")) return;
    try {
      setLoading(true);
      await courseAPI.delete(id);
      showAlert("✅ Course deleted successfully!", "success");
      loadCourses();
      if (selectedCourse?.id === id) {
        setSelectedCourse(null);
        setActiveTab("courses");
      }
    } catch (err) {
      showAlert("❌ " + (err.message || "Failed to delete course"), "error");
    } finally {
      setLoading(false);
    }
  };

  // ============== SUBJECT HANDLERS ==============
  const handleCreateSubject = async () => {
    try {
      setLoading(true);
      await subjectAPI.create(selectedCourse.id, subjectForm);
      showAlert("✅ Subject created successfully!", "success");
      setSubjectForm({ name: "", description: "" });
      setShowSubjectModal(false);
      loadSubjects(selectedCourse.id);
    } catch (err) {
      showAlert("❌ " + (err.message || "Failed to create subject"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubject = async () => {
    try {
      setLoading(true);
      await subjectAPI.update(selectedCourse.id, editingItem.id, subjectForm);
      showAlert("✅ Subject updated successfully!", "success");
      setSubjectForm({ name: "", description: "" });
      setShowSubjectModal(false);
      setEditingItem(null);
      loadSubjects(selectedCourse.id);
    } catch (err) {
      showAlert("❌ " + (err.message || "Failed to update subject"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Delete this subject? All topics will be deleted.")) return;
    try {
      setLoading(true);
      await subjectAPI.delete(selectedCourse.id, id);
      showAlert("✅ Subject deleted successfully!", "success");
      loadSubjects(selectedCourse.id);
    } catch (err) {
      showAlert("❌ " + (err.message || "Failed to delete subject"), "error");
    } finally {
      setLoading(false);
    }
  };

  // ============== TOPIC HANDLERS ==============
  const handleCreateTopic = async () => {
    try {
      setLoading(true);
      await topicAPI.create(selectedCourse.id, selectedSubject.id, topicForm);
      showAlert("✅ Topic created successfully!", "success");
      setTopicForm({ title: "", description: "" });
      setShowTopicModal(false);
      loadTopics(selectedSubject.id);
    } catch (err) {
      showAlert("❌ " + (err.message || "Failed to create topic"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTopic = async () => {
    try {
      setLoading(true);
      await topicAPI.update(editingItem.id, topicForm);
      showAlert("✅ Topic updated successfully!", "success");
      setTopicForm({ title: "", description: "" });
      setShowTopicModal(false);
      setEditingItem(null);
      loadTopics(selectedSubject.id);
    } catch (err) {
      showAlert("❌ " + (err.message || "Failed to update topic"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (id) => {
    if (!window.confirm("Delete this topic? All materials will be deleted.")) return;
    try {
      setLoading(true);
      await topicAPI.delete(id);
      showAlert("✅ Topic deleted successfully!", "success");
      loadTopics(selectedSubject.id);
    } catch (err) {
      showAlert("❌ " + (err.message || "Failed to delete topic"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaterial = async () => {
    try {
      setLoading(true);
      // For file uploads, copy fileUrl to link
      const materialToSend = { ...materialForm };
      if (["PDF", "FILE_DOWNLOAD", "DOCUMENT"].includes(materialForm.type) && materialForm.fileUrl) {
        materialToSend.link = materialForm.fileUrl;
      }
      await materialAPI.create(selectedTopic.id, materialToSend);
      showAlert("✅ Material added successfully!", "success");
      resetForm();
      // IMPORTANT: Keep modal OPEN and reload materials list
      // Do NOT close modal - user can add more materials
      if (selectedTopic) loadMaterials(selectedTopic.id);
      // DO NOT navigate or close modal here
    } catch (err) {
      showAlert("❌ " + (err.message || "Failed to create material"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm("Delete this material?")) return;
    try {
      setLoading(true);
      await materialAPI.delete(id);
      showAlert("✅ Material deleted successfully!", "success");
      // IMPORTANT: Keep modal OPEN
      // Do NOT close modal - user can manage more materials
      if (selectedTopic) loadMaterials(selectedTopic.id);
      // DO NOT navigate or close modal here
    } catch (err) {
      showAlert("❌ " + (err.message || "Failed to delete material"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMaterial = async () => {
    if (!editingItem) return;
    try {
      setLoading(true);
      const materialToSend = { ...materialForm };
      if (["PDF", "FILE_DOWNLOAD", "DOCUMENT"].includes(materialForm.type) && materialForm.fileUrl) {
        materialToSend.link = materialForm.fileUrl;
      }
      await materialAPI.update(editingItem.id, materialToSend);
      showAlert("✅ Material updated successfully!", "success");
      resetForm();
      setEditingItem(null);
      // Reload materials list and keep modal open
      if (selectedTopic) loadMaterials(selectedTopic.id);
    } catch (err) {
      showAlert("❌ " + (err.message || "Failed to update material"), "error");
    } finally {
      setLoading(false);
    }
  };

  const openMaterialEditModal = (material) => {
    setMaterialForm({
      title: material.title,
      description: material.description,
      type: material.type,
      fileUrl: material.fileUrl || material.link,
      link: material.link || "",
      difficulty: material.difficulty || "BEGINNER",
      topicId: selectedTopic.id,
    });
    setEditingItem(material);
  };

  const handleCancelMaterialEdit = () => {
    resetForm();
    setEditingItem(null);
  };

  // ============== UI HELPERS ==============
  const openCourseModal = (item = null) => {
    if (item) {
      setCourseForm({
        title: item.title,
        description: item.description,
        difficulty: item.difficulty || "BEGINNER",
      });
      setEditingItem(item);
    } else {
      setCourseForm({ title: "", description: "", difficulty: "BEGINNER" });
      setEditingItem(null);
    }
    setShowCourseModal(true);
  };

  const openSubjectModal = (item = null) => {
    if (item) {
      setSubjectForm({ name: item.name, description: item.description });
      setEditingItem(item);
    } else {
      setSubjectForm({ name: "", description: "" });
      setEditingItem(null);
    }
    setShowSubjectModal(true);
  };

  const openTopicModal = (item = null) => {
    if (item) {
      setTopicForm({ title: item.title, description: item.description });
      setEditingItem(item);
    } else {
      setTopicForm({ title: "", description: "" });
      setEditingItem(null);
    }
    setShowTopicModal(true);
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setShowMaterialModal(false);
    navigate(`/instructor/courses/${course.id}`);
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setSelectedTopic(null);
    setShowMaterialModal(false);
    if (selectedCourse) {
      navigate(`/instructor/courses/${selectedCourse.id}/subjects/${subject.id}`);
    }
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    loadMaterials(topic.id);
    setShowMaterialModal(true);
    if (selectedCourse && selectedSubject) {
      navigate(`/instructor/courses/${selectedCourse.id}/subjects/${selectedSubject.id}/topics/${topic.id}`);
    }
  };

  // ============== RENDER ==============
  return (
    <div className="course-management-container">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
      {loading && <div className="loading-overlay"><div className="loading-spinner"></div></div>}

      <div className="course-management-wrapper">
        {/* COURSES VIEW */}
        {!courseId && (
          <div>
            <div className="page-header">
              <div>
                <h1>📚 Course Management</h1>
                <p>Organize your educational content into courses, subjects, and topics</p>
              </div>
              <button className="btn-primary-large" onClick={() => openCourseModal()}>
                ➕ New Course
              </button>
            </div>
            <CourseList
              courses={courses}
              onEdit={openCourseModal}
              onSelect={handleSelectCourse}
              onDelete={handleDeleteCourse}
              onAddCourse={() => openCourseModal()}
            />
          </div>
        )}

        {/* SUBJECTS VIEW */}
        {courseId && !subjectId && selectedCourse && (
          <div>
            <div className="breadcrumb-nav">
              <button 
                className="breadcrumb-item"
                onClick={() => {
                  navigate("/instructor/courses");
                  setSelectedCourse(null);
                  setSelectedSubject(null);
                  setSelectedTopic(null);
                }}
              >
                📚 Courses
              </button>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item breadcrumb-active">
                📕 {selectedCourse.title}
              </span>
            </div>
            
            <div className="page-header">
              <div>
                <h2>Subjects in {selectedCourse.title}</h2>
                <p>Organize subjects and create learning topics</p>
              </div>
              <button className="btn-primary-large" onClick={() => openSubjectModal()}>
                ➕ New Subject
              </button>
            </div>
            <SubjectList
              subjects={subjects}
              onEdit={openSubjectModal}
              onSelect={handleSelectSubject}
              onDelete={handleDeleteSubject}
            />
          </div>
        )}

        {/* TOPICS VIEW */}
        {courseId && subjectId && !topicId && selectedSubject && (
          <div>
            <div className="breadcrumb-nav">
              <button 
                className="breadcrumb-item"
                onClick={() => {
                  navigate("/instructor/courses");
                  setSelectedCourse(null);
                  setSelectedSubject(null);
                  setSelectedTopic(null);
                }}
              >
                📚 Courses
              </button>
              <span className="breadcrumb-separator">/</span>
              <button 
                className="breadcrumb-item"
                onClick={() => {
                  navigate(`/instructor/courses/${courseId}`);
                  setSelectedSubject(null);
                  setSelectedTopic(null);
                }}
              >
                📕 {selectedCourse?.title}
              </button>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item breadcrumb-active">
                📝 {selectedSubject.name}
              </span>
            </div>
            
            <div className="page-header">
              <div>
                <h2>Topics in {selectedSubject.name}</h2>
                <p>Create topics and add learning materials</p>
              </div>
              <button className="btn-primary-large" onClick={() => openTopicModal()}>
                ➕ New Topic
              </button>
            </div>
            <TopicList
              topics={topics}
              onEdit={openTopicModal}
              onSelect={handleSelectTopic}
              onDelete={handleDeleteTopic}
            />
          </div>
        )}

        {/* TOPIC DETAIL VIEW WITH MATERIALS */}
        {courseId && subjectId && topicId && selectedTopic && (
          <div>
            <div className="breadcrumb-nav">
              <button 
                className="breadcrumb-item"
                onClick={() => {
                  navigate("/instructor/courses");
                  setSelectedCourse(null);
                  setSelectedSubject(null);
                  setSelectedTopic(null);
                  setShowMaterialModal(false);
                }}
              >
                📚 Courses
              </button>
              <span className="breadcrumb-separator">/</span>
              <button 
                className="breadcrumb-item"
                onClick={() => {
                  navigate(`/instructor/courses/${courseId}`);
                  setSelectedSubject(null);
                  setSelectedTopic(null);
                  setShowMaterialModal(false);
                }}
              >
                📕 {selectedCourse?.title}
              </button>
              <span className="breadcrumb-separator">/</span>
              <button 
                className="breadcrumb-item"
                onClick={() => {
                  navigate(`/instructor/courses/${courseId}/subjects/${subjectId}`);
                  setSelectedTopic(null);
                  setShowMaterialModal(false);
                }}
              >
                📝 {selectedSubject?.name}
              </button>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item breadcrumb-active">
                🎓 {selectedTopic.title}
              </span>
            </div>
            
            <div className="page-header">
              <div>
                <h2>📚 {selectedTopic.title}</h2>
                <p>{selectedTopic.description || "Manage materials for this topic"}</p>
              </div>
              <button className="btn-primary-large" onClick={() => setShowMaterialModal(true)}>
                ➕ Add Material
              </button>
            </div>

            {/* Materials Display */}
            {materials && materials.length > 0 ? (
              <div className="materials-display-grid">
                {materials.map((material) => (
                  <div key={material.id} className="material-card">
                    <div className="material-card-header">
                      <h3>{material.title}</h3>
                      <button 
                        className="material-delete-btn"
                        onClick={() => handleDeleteMaterial(material.id)}
                        title="Delete material"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="material-description">{material.description}</p>
                    
                    {/* YouTube Video Display */}
                    {material.type === "YOUTUBE_VIDEO" && material.link && (
                      <div className="material-youtube">
                        <iframe
                          width="100%"
                          height="240"
                          src={convertYouTubeUrlToEmbed(material.link)}
                          title={material.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ borderRadius: "8px" }}
                        ></iframe>
                      </div>
                    )}

                    {/* PDF Download Button - Using API */}
                    {material.type === "PDF" && material.link && (
                      <div className="material-file-link">
                        <button
                          onClick={() => materialAPI.downloadFile(material.link, material.title)}
                          className="btn-file-download"
                          title="Download PDF"
                        >
                          📥 Download
                        </button>
                      </div>
                    )}

                    {/* File Download Button - Using API */}
                    {(material.type === "FILE_DOWNLOAD" || material.type === "DOCUMENT") && material.link && (
                      <div className="material-file-link">
                        <button
                          onClick={() => materialAPI.downloadFile(material.link, material.title)}
                          className="btn-file-download"
                          title="Download file"
                        >
                          📥 Download
                        </button>
                      </div>
                    )}

                    {/* External Link */}
                    {material.type === "LINK" && material.link && (
                      <div className="material-external-link">
                        <a href={material.link} target="_blank" rel="noopener noreferrer" className="btn-external-link">
                          🔗 Open Link
                        </a>
                      </div>
                    )}

                    <div className="material-meta">
                      <span className="material-type">{material.type}</span>
                      <span className="material-difficulty">{material.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No materials added yet for this topic</p>
                <button className="btn-primary" onClick={() => setShowMaterialModal(true)}>
                  ➕ Add First Material
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      <CourseModal
        isOpen={showCourseModal}
        isEditing={!!editingItem}
        courseForm={courseForm}
        onFormChange={setCourseForm}
        onSubmit={editingItem ? handleUpdateCourse : handleCreateCourse}
        onClose={() => setShowCourseModal(false)}
      />

      <SubjectModal
        isOpen={showSubjectModal}
        isEditing={!!editingItem}
        subjectForm={subjectForm}
        onFormChange={setSubjectForm}
        onSubmit={editingItem ? handleUpdateSubject : handleCreateSubject}
        onClose={() => setShowSubjectModal(false)}
      />

      <TopicModal
        isOpen={showTopicModal}
        isEditing={!!editingItem}
        topicForm={topicForm}
        onFormChange={setTopicForm}
        onSubmit={editingItem ? handleUpdateTopic : handleCreateTopic}
        onClose={() => setShowTopicModal(false)}
      />

      <MaterialModal
        isOpen={showMaterialModal}
        selectedTopic={selectedTopic}
        materials={materials}
        materialForm={materialForm}
        files={files}
        onFormChange={setMaterialForm}
        onFileSelect={handleFileSelect}
        onFileRemove={removeFile}
        onSubmit={handleCreateMaterial}
        onUpdate={handleUpdateMaterial}
        onEdit={openMaterialEditModal}
        onDelete={handleDeleteMaterial}
        onDownload={(fileUrl) => materialAPI.downloadFile(fileUrl)}
        onClose={() => setShowMaterialModal(false)}
        isEditingMaterial={!!editingItem}
        onCancelEdit={handleCancelMaterialEdit}
      />
    </div>
  );
}
