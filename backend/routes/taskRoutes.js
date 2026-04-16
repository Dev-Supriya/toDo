const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All task routes are protected
router.use(protect);

router.post('/', upload.single('attachment'), createTask);
router.get('/', getTasks);
router.put('/:id', upload.single('attachment'), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
