import React from "react";

export default function CourseModal({ isOpen, isEditing, courseForm, onFormChange, onSubmit, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "✏️ Edit Course" : "➕ Create New Course"}</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Course Title *</label>
            <input
              type="text"
              value={courseForm.title}
              onChange={(e) => onFormChange({ ...courseForm, title: e.target.value })}
              placeholder="e.g., Python Fundamentals"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={courseForm.description}
              onChange={(e) => onFormChange({ ...courseForm, description: e.target.value })}
              placeholder="Describe your course..."
              maxLength="500"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Difficulty Level</label>
            <select
              value={courseForm.difficulty}
              onChange={(e) => onFormChange({ ...courseForm, difficulty: e.target.value })}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div className="form-buttons">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-submit"
              onClick={onSubmit}
              disabled={!courseForm.title || !courseForm.description}
            >
              {isEditing ? "Update" : "Create"} Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
