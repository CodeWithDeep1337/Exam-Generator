const Form = ({ title, fields, onSubmit, onCancel, isLoading }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={onSubmit} className="form">
          {fields.map((field) => (
            <div key={field.name} className="form-group">
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={field.rows || 4}
                ></textarea>
              ) : field.type === "file" ? (
                <input
                  id={field.name}
                  type="file"
                  name={field.name}
                  accept={field.accept}
                  onChange={field.onChange}
                />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  type={field.type || "text"}
                  name={field.name}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
              {field.error && <span className="field-error">{field.error}</span>}
            </div>
          ))}

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
