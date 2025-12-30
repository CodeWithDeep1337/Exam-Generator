import React from "react";

export default function SubjectList({ subjects, onEdit, onSelect, onDelete }) {
  if (subjects.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h3>No subjects yet</h3>
        <p>Create your first subject to organize topics</p>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {subjects.map((subject) => (
        <div key={subject.id} className="subject-card">
          <div className="card-header">
            <h3>{subject.name}</h3>
            <span className="card-icon">📚</span>
          </div>
          
          <p className="card-description">
            {subject.description || "No description"}
          </p>

          <div className="card-actions">
            <button 
              className="btn-action btn-select"
              onClick={() => onSelect(subject)}
              title="View topics"
            >
              📝 View Topics
            </button>
            <button 
              className="btn-action btn-edit"
              onClick={() => onEdit(subject)}
              title="Edit subject"
            >
              ✏️
            </button>
            <button 
              className="btn-action btn-delete"
              onClick={() => {
                if (window.confirm(`Delete "${subject.name}"?`)) {
                  onDelete(subject.id);
                }
              }}
              title="Delete subject"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
