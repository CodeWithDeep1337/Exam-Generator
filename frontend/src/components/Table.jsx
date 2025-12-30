const Table = ({ title, columns, data, onEdit, onDelete, onClose }) => {
  return (
    <div className="table-modal-overlay" onClick={onClose}>
      <div className="table-container" onClick={(e) => e.stopPropagation()}>
        <div className="table-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id}>
                    {columns.map((col) => (
                      <td key={col}>
                        {col.toLowerCase() === "image" && item[col] ? (
                          <img src={item[col]} alt="thumbnail" className="table-image" />
                        ) : (
                          item[col] || "-"
                        )}
                      </td>
                    ))}
                    <td className="actions-cell">
                      <button className="btn btn-sm btn-primary" onClick={() => onEdit(item)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => onDelete(item.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="empty-state">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
