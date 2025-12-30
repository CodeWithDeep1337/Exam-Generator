import React from "react";

export default function CourseList({ courses, onEdit, onSelect, onDelete, onAddCourse }) {
  if (courses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h3>No courses yet</h3>
        <p>Create your first course to get started</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Difficulty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="font-bold">{course.title}</td>
              <td>{course.description?.substring(0, 50)}...</td>
              <td>
                <span className={`difficulty-badge difficulty-${course.difficulty?.toLowerCase()}`}>
                  {course.difficulty || "BEGINNER"}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button className="btn-edit" onClick={() => onEdit(course)} title="Edit course">
                    ✏️ Edit
                  </button>
                  <button className="btn-manage" onClick={() => onSelect(course)} title="View subjects">
                    📚 Select
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(course.id)} title="Delete course">
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
