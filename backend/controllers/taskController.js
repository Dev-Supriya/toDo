const path = require('path');
const fs = require('fs');
const Task = require('../models/Task');

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const taskData = {
      title,
      description: description || '',
      userId: req.user._id,
    };

    if (req.file) {
      taskData.attachment = req.file.filename;
    }

    const task = await Task.create(taskData);
    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) {
      if (!['pending', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Status must be pending or completed' });
      }
      task.status = status;
    }

    // Handle new file upload — remove old file if replaced
    if (req.file) {
      if (task.attachment) {
        const oldPath = path.join(__dirname, '..', 'uploads', task.attachment);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      task.attachment = req.file.filename;
    }

    const updated = await task.save();
    res.json({ message: 'Task updated', task: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove attachment file from disk
    if (task.attachment) {
      const filePath = path.join(__dirname, '..', 'uploads', task.attachment);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
