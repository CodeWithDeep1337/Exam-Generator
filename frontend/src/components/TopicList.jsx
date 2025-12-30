import React from "react";

export default function TopicList({ topics, onEdit, onSelect, onDelete }) {
  if (topics.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h3>No topics yet</h3>
        <p>Create your first topic to add learning materials</p>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {topics.map((topic) => (
        <div key={topic.id} className="topic-card">
          <div className="card-header">
            <h3>{topic.title}</h3>
            <span className="material-badge">📚 {topic.materialCount || 0}</span>
          </div>
          
          <p className="card-description">
            {topic.description || "No description"}
          </p>

          <div className="card-stats">
            <div className="stat-item">
              <span className="stat-label">Materials</span>
              <span className="stat-value">{topic.materialCount || 0}</span>
            </div>
          </div>

          <div className="card-actions">
            <button 
              className="btn-action btn-select"
              onClick={() => onSelect(topic)}
              title="View materials"
            >
              📥 Materials
            </button>
            <button 
              className="btn-action btn-edit"
              onClick={() => onEdit(topic)}
              title="Edit topic"
            >
              ✏️
            </button>
            <button 
              className="btn-action btn-delete"
              onClick={() => {
                if (window.confirm(`Delete "${topic.title}"?`)) {
                  onDelete(topic.id);
                }
              }}
              title="Delete topic"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
