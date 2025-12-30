import React from "react";

export default function TopicModal({ isOpen, isEditing, topicForm, onFormChange, onSubmit, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "✏️ Edit Topic" : "➕ Create New Topic"}</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Topic Title *</label>
            <input
              type="text"
              value={topicForm.title}
              onChange={(e) => onFormChange({ ...topicForm, title: e.target.value })}
              placeholder="e.g., Arrays and Lists"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={topicForm.description}
              onChange={(e) => onFormChange({ ...topicForm, description: e.target.value })}
              placeholder="Describe this topic..."
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
              disabled={!topicForm.title || !topicForm.description}
            >
              {isEditing ? "Update" : "Create"} Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
