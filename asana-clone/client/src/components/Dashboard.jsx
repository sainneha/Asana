import React, { useState, useContext } from 'react';
import { TextField, Button, List, ListItem, ListItemText, IconButton, Container, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TaskContext } from '../components/TaskContext';

const Dashboard = () => {
  const { user, tasks, addTask, updateTask, deleteTask } = useContext(TaskContext);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTask) {
      await updateTask(editingTask._id, { ...formData, userId: user.userId });
      setEditingTask(null);
    } else {
      await addTask({ ...formData, userId: user.userId });
    }
    setFormData({ title: '', description: '' });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description });
  };

  return (
    <Container maxWidth="md" className="py-8 min-h-screen bg-gray-100"id="dash">
      <Paper elevation={3} className="p-6 rounded-lg">
        <Typography variant="h4" className="mb-6 text-center text-gray-800 font-bold">
          Welcome, {user?.username || 'User'}!
        </Typography>
        
        {/* Task Form */}
        <div className="mb-8" id="form-dash">
          <Typography variant="h5" className="mb-4 text-gray-70">
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </Typography>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              className="bg-white"
              InputProps={{
                className: 'rounded-md'
              }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              className="bg-white"
              InputProps={{
                className: 'rounded-md'
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color={editingTask ? 'warning' : 'primary'}
              className="mt-2 py-2 rounded-md hover:shadow-lg transition-shadow"
            >
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
          </form>
        </div>

        {/* Task List */}
        <Typography variant="h5" className="mb-4 text-gray-700">
          Your Tasks
        </Typography>
        {tasks.length === 0 ? (
          <Typography variant="body1" className="text-gray-500 text-center">
            No tasks yet. Add a task to get started!
          </Typography>
        ) : (
          <List className="bg-white rounded-md shadow-sm">
            {tasks.map((task) => (
              <ListItem
                key={task._id}
                className="border-b hover:bg-gray-50 transition-colors"
                secondaryAction={
                  <div>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(task)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteTask(task._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" className="font-semibold">
                      {task.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" className="text-gray-600">
                      {task.description || 'No description'}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;