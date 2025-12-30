const Card = ({ title, icon, color, count, onAdd, onView }) => (
  <div className="card" style={{ borderLeftColor: color }}>
    <div className="card-header">
      <span className="card-icon">{icon}</span>
      <h3 className="card-title">{title}</h3>
    </div>
    <div className="card-body">
      <p className="card-count">{count} {count === 1 ? 'item' : 'items'}</p>
    </div>
    <div className="card-footer">
      <button className="btn btn-primary" onClick={onAdd}>+ Add</button>
      <button className="btn btn-secondary" onClick={onView}>View</button>
    </div>
  </div>
);

export default Card;
