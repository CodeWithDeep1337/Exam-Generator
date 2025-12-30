import React from "react";
import MaterialList from "./MaterialList";

export default function MaterialModal({
  isOpen,
  selectedTopic,
  materials,
  materialForm,
  files,
  onFormChange,
  onFileSelect,
  onFileRemove,
  onSubmit,
  onUpdate,
  onEdit,
  onDelete,
  onDownload,
  onClose,
  isEditingMaterial,
  onCancelEdit,
}) {
  if (!isOpen || !selectedTopic) return null;

  const handleSubmitClick = async () => {
    if (isEditingMaterial) {
      await onUpdate();
    } else {
      await onSubmit();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>📚 {selectedTopic.title}</h2>
            <p>{isEditingMaterial ? "Edit material details" : "Add and manage learning materials"}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Material Form - Add or Edit */}
          <div className="material-form-section">
            <h3>{isEditingMaterial ? "✏️ Edit Material" : "➕ Add New Material"}</h3>

            <div className="form-group">
              <label>Material Title <span className="form-required">*</span></label>
              <input
                type="text"
                value={materialForm.title}
                onChange={(e) => onFormChange({ ...materialForm, title: e.target.value })}
                placeholder="e.g., Introduction to Topics"
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={materialForm.description}
                onChange={(e) => onFormChange({ ...materialForm, description: e.target.value })}
                placeholder="Describe this material..."
                maxLength="500"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type *</label>
                <select
                  value={materialForm.type}
                  onChange={(e) => onFormChange({ ...materialForm, type: e.target.value })}
                >
                  <option value="YOUTUBE_VIDEO">📹 YouTube Video</option>
                  <option value="PDF">📄 PDF File</option>
                  <option value="FILE_DOWNLOAD">📥 File Download</option>
                  <option value="DOCUMENT">📝 Document</option>
                  <option value="LINK">🔗 External Link</option>
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={materialForm.difficulty}
                  onChange={(e) => onFormChange({ ...materialForm, difficulty: e.target.value })}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            {(materialForm.type === "LINK" || materialForm.type === "YOUTUBE_VIDEO") && (
              <div className="form-group">
                <label>{materialForm.type === "YOUTUBE_VIDEO" ? "YouTube URL" : "External Link"} *</label>
                <input
                  type="url"
                  value={materialForm.link}
                  onChange={(e) => onFormChange({ ...materialForm, link: e.target.value })}
                  placeholder={materialForm.type === "YOUTUBE_VIDEO" ? "https://youtube.com/watch?v=..." : "https://example.com"}
                />
              </div>
            )}

            {["PDF", "FILE_DOWNLOAD", "DOCUMENT"].includes(materialForm.type) && (
              <div className="file-upload-group">
                <label className="file-input-label">Upload File</label>
                <div className="file-input-box" onClick={() => document.getElementById("fileInput").click()}>
                  <p className="file-input-text">📁 Click to upload or drag and drop</p>
                  <p className="file-input-hint">Supported: PDF, ZIP, DOC, DOCX, TXT, PPTX</p>
                  <input
                    id="fileInput"
                    type="file"
                    onChange={onFileSelect}
                    accept={materialForm.type === "PDF" ? ".pdf" : ".zip,.doc,.docx,.txt,.pptx"}
                  />
                </div>
                {files.length > 0 && (
                  <div className="file-list">
                    {files.map((file, idx) => (
                      <div key={idx} className="file-item">
                        <span>📎 {file.name}</span>
                        <button className="file-item-remove" onClick={() => onFileRemove(idx)}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="form-buttons">
              {isEditingMaterial ? (
                <>
                  <button className="btn-cancel" onClick={onCancelEdit}>
                    Cancel Edit
                  </button>
                  <button
                    className="btn-submit"
                    onClick={handleSubmitClick}
                    disabled={!materialForm.title || (["LINK", "YOUTUBE_VIDEO"].includes(materialForm.type) && !materialForm.link)}
                  >
                    ✏️ Update Material
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-cancel" onClick={onClose}>
                    Close
                  </button>
                  <button
                    className="btn-submit"
                    onClick={handleSubmitClick}
                    disabled={!materialForm.title || (["LINK", "YOUTUBE_VIDEO"].includes(materialForm.type) && !materialForm.link)}
                  >
                    ➕ Add Material
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Materials List */}
          {materials && materials.length > 0 && (
            <div className="materials-list-section">
              <h3>📚 Materials ({materials.length})</h3>
              <MaterialList
                materials={materials}
                onEdit={onEdit}
                onDelete={onDelete}
                onDownload={onDownload}
              />
            </div>
          )}
          {(!materials || materials.length === 0) && (
            <div className="empty-materials">
              <p>📭 No materials added yet. Add your first material above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
