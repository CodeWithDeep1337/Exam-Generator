import React from "react";

export default function SubjectModal({ isOpen, isEditing, subjectForm, onFormChange, onSubmit, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "✏️ Edit Subject" : "➕ Create New Subject"}</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Subject Name *</label>
            <input
              type="text"
              value={subjectForm.name}
              onChange={(e) => onFormChange({ ...subjectForm, name: e.target.value })}
              placeholder="e.g., Data Structures"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={subjectForm.description}
              onChange={(e) => onFormChange({ ...subjectForm, description: e.target.value })}
              placeholder="Describe this subject..."
              maxLength="500"
              rows={4}
            />
          </div>

          <div className="form-buttons">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-submit"
              onClick={onSubmit}
              disabled={!subjectForm.name || !subjectForm.description}
            >
              {isEditing ? "Update" : "Create"} Subject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
