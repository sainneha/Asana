const Task = require('../models/task');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createTask = async (req, res) => {
  const { title, description, userId } = req.body;
  try {
    const task = new Task({ title, description, userId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };