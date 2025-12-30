import React from "react";

export default function MaterialList({ materials, onEdit, onDelete, onDownload }) {
  if (materials.length === 0) {
    return (
      <div className="empty-materials">
        <p>📭 No materials added yet</p>
      </div>
    );
  }

  return (
    <div className="materials-grid">
      {materials.map((material) => (
        <div key={material.id} className="material-card">
          <div className="material-header">
            <h4>{material.title}</h4>
            <span className="material-type-badge">{material.type}</span>
          </div>
          <p className="material-description">{material.description}</p>
          <div className="material-meta">
            <span className={`material-difficulty difficulty-${material.difficulty?.toLowerCase()}`}>
              {material.difficulty}
            </span>
          </div>
          <div className="material-actions">
            {material.link && (
              <a 
                href={material.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="material-link-btn"
                title="Open external link"
              >
                🔗 Link
              </a>
            )}
            {material.fileUrl && (
              <button
                onClick={() => onDownload(material.fileUrl)}
                className="material-download-btn"
                title="Download file"
              >
                📥 Download
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(material)}
                className="material-edit-btn"
                title="Edit material"
              >
                ✏️ Edit
              </button>
            )}
            <button
              onClick={() => onDelete(material.id)}
              className="material-delete-btn"
              title="Delete material"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
