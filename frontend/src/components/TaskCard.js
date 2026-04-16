import React, { useState } from 'react';
import api from '../api/axios';

const API_BASE = 'http://localhost:5000';

function TaskCard({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleStatus = async () => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    try {
      const res = await api.put(`/tasks/${task._id}`, { status: newStatus });
      onUpdate(res.data.task);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      onDelete(task._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      if (file) formData.append('attachment', file);

      const res = await api.put(`/tasks/${task._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onUpdate(res.data.task);
      setEditing(false);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="task-card-header">
        <span className="task-title">{task.title}</span>
        <span className={`task-badge ${task.status === 'completed' ? 'badge-completed' : 'badge-pending'}`}>
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.attachment && (
        <div className="task-attachment">
          📎{' '}
          <a
            href={`${API_BASE}/uploads/${task.attachment}`}
            target="_blank"
            rel="noreferrer"
          >
            View Attachment
          </a>
        </div>
      )}

      <p className="task-date">Created: {formatDate(task.createdAt)}</p>

      <div className="task-actions">
        <button
          className={`btn ${task.status === 'completed' ? 'btn-secondary' : 'btn-success'}`}
          onClick={handleToggleStatus}
        >
          {task.status === 'completed' ? 'Mark Pending' : 'Complete'}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => { setEditing(!editing); setError(''); }}
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>

      {editing && (
        <form className="task-edit-form" onSubmit={handleUpdate}>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Replace Attachment</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
            {file && <p className="file-name">Selected: {file.name}</p>}
          </div>
          <div className="task-form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TaskCard;
