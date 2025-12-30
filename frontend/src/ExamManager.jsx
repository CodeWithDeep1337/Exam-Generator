import { useState } from 'react';
import './ExamManager.css';

export default function ExamManager({ user, onBack }) {
  const [exams, setExams] = useState([
    {
      id: 1,
      title: 'Mathematics 101',
      questions: 50,
      duration: 120,
      difficulty: 'Intermediate',
      created: '2024-12-01',
      status: 'Active',
      attempts: 45,
      avgScore: 72
    },
    {
      id: 2,
      title: 'Physics Basics',
      questions: 40,
      duration: 90,
      difficulty: 'Beginner',
      created: '2024-11-15',
      status: 'Active',
      attempts: 32,
      avgScore: 78
    },
    {
      id: 3,
      title: 'Chemistry Advanced',
      questions: 45,
      duration: 150,
      difficulty: 'Advanced',
      created: '2024-10-20',
      status: 'Inactive',
      attempts: 12,
      avgScore: 65
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    questions: '',
    duration: '',
    difficulty: 'Intermediate'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setExams(exams.map(exam =>
        exam.id === editingId ? { ...exam, ...formData } : exam
      ));
      setEditingId(null);
    } else {
      const newExam = {
        id: Math.max(...exams.map(e => e.id)) + 1,
        ...formData,
        created: new Date().toISOString().split('T')[0],
        status: 'Active',
        attempts: 0,
        avgScore: 0
      };
      setExams([...exams, newExam]);
    }
    setFormData({ title: '', questions: '', duration: '', difficulty: 'Intermediate' });
    setShowForm(false);
  };

  const handleEdit = (exam) => {
    setFormData(exam);
    setEditingId(exam.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this exam?')) {
      setExams(exams.filter(exam => exam.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', questions: '', duration: '', difficulty: 'Intermediate' });
  };

  return (
    <div className="exam-manager-container">
      <div className="em-header">
        <button className="em-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>📝 Exam Manager</h1>
        <button
          className="em-create-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '➕ Create Exam'}
        </button>
      </div>

      {/* Create Exam Form */}
      {showForm && (
        <div className="em-form-container">
          <div className="em-form-card">
            <h2>{editingId ? 'Edit Exam' : 'Create New Exam'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Exam Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter exam title"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Number of Questions *</label>
                  <input
                    type="number"
                    name="questions"
                    value={formData.questions}
                    onChange={handleInputChange}
                    placeholder="50"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration (minutes) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="120"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty Level</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingId ? '💾 Update Exam' : '✨ Create Exam'}
                </button>
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exams List */}
      <div className="em-content">
        {exams.length === 0 ? (
          <div className="em-empty">
            <p>📭 No exams yet. Create one to get started!</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              ➕ Create First Exam
            </button>
          </div>
        ) : (
          <div className="em-exams-grid">
            {exams.map(exam => (
              <div key={exam.id} className="em-exam-card">
                <div className="em-card-header">
                  <h3>{exam.title}</h3>
                  <span className={`em-status em-status-${exam.status.toLowerCase()}`}>
                    {exam.status}
                  </span>
                </div>

                <div className="em-card-meta">
                  <div className="meta-item">
                    <span className="meta-label">❓ Questions</span>
                    <span className="meta-value">{exam.questions}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">⏱️ Duration</span>
                    <span className="meta-value">{exam.duration}m</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">📊 Difficulty</span>
                    <span className="meta-value">{exam.difficulty}</span>
                  </div>
                </div>

                <div className="em-card-stats">
                  <div className="stat">
                    <span className="stat-icon">👥</span>
                    <div>
                      <p className="stat-label">Attempts</p>
                      <p className="stat-value">{exam.attempts}</p>
                    </div>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">📈</span>
                    <div>
                      <p className="stat-label">Avg Score</p>
                      <p className="stat-value">{exam.avgScore}%</p>
                    </div>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">📅</span>
                    <div>
                      <p className="stat-label">Created</p>
                      <p className="stat-value">{exam.created}</p>
                    </div>
                  </div>
                </div>

                <div className="em-card-actions">
                  <button
                    className="em-btn em-btn-view"
                    title="View Exam"
                  >
                    👁️ View
                  </button>
                  <button
                    className="em-btn em-btn-edit"
                    onClick={() => handleEdit(exam)}
                    title="Edit Exam"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="em-btn em-btn-results"
                    title="View Results"
                  >
                    📊 Results
                  </button>
                  <button
                    className="em-btn em-btn-delete"
                    onClick={() => handleDelete(exam.id)}
                    title="Delete Exam"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
