import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, IconButton, Container, Paper, Typography, CircularProgress, Snackbar, Alert, Fade, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { TaskContext } from '../components/TaskContext';

const Dashboard = () => {
  const { user, tasks, addTask, updateTask, deleteTask, loading, message, setMessage } = useContext(TaskContext);
  const [formData, setFormData] = useState({ title: '', description: '', completed: false });
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [titleError, setTitleError] = useState(false);
  const TITLE_MAX_LENGTH = 50;

  useEffect(() => {
    let sortedTasks = [...tasks];
    
    // Search filter
    sortedTasks = sortedTasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting
    if (sortBy === 'createdAt-desc') {
      sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'createdAt-asc') {
      sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'completed') {
      sortedTasks.sort((a, b) => (b.completed ? 1 : -1) - (a.completed ? 1 : -1));
    }

    setFilteredTasks(sortedTasks);
  }, [searchQuery, sortBy, tasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title' && value.length > TITLE_MAX_LENGTH) return;
    setFormData({ ...formData, [name]: value });
    if (name === 'title') {
      setTitleError(value.trim() === '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setTitleError(true);
      setMessage({ type: 'error', text: 'Task title cannot be empty!' });
      return;
    }
    if (editingTask) {
      await updateTask(editingTask._id, { ...formData, userId: user._id });
      setEditingTask(null);
    } else {
      await addTask({ ...formData, userId: user._id });
    }
    setFormData({ title: '', description: '', completed: false });
    setTitleError(false);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description, completed: task.completed || false });
    setTitleError(false);
  };

  const handleClearForm = () => {
    setFormData({ title: '', description: '', completed: false });
    setEditingTask(null);
    setTitleError(false);
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  const handleToggleComplete = async (task) => {
    await updateTask(task._id, { ...task, completed: !task.completed });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <Container maxWidth="md" className="py-8 min-h-screen bg-gradient-to-br from-blue-100 to-purple-200" id="form-dash">
      <Paper elevation={6} className="p-8 rounded-2xl shadow-2xl" >
        <Fade in={!loading} timeout={600}>
          <Typography variant="h4" className="mb-6 text-center text-gray-900 font-bold" role="heading" aria-label="Welcome message">
            Welcome, {user?.username || 'User'}!
          </Typography>
        </Fade>

        {/* Task Count */}
        <Typography variant="subtitle1" className="mb-4 text-gray-700 text-center">
          Aapke paas {tasks.length} {tasks.length === 1 ? 'task hai' : 'tasks hain'}
        </Typography>

        {/* Search and Sort */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <TextField
            label="Search Tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            className="w-full max-w-md bg-white rounded-lg"
            InputProps={{
              className: 'rounded-lg border-gray-300',
              startAdornment: <SearchIcon className="text-gray-500 mr-2" />,
            }}
            inputProps={{ 'aria-label': 'Search tasks input' }}
          />
          <FormControl className="w-full max-w-[200px]">
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white rounded-lg"
            >
              <MenuItem value="createdAt-desc">Newest First</MenuItem>
              <MenuItem value="createdAt-asc">Oldest First</MenuItem>
              <MenuItem value="completed">Completed First</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Task Form */}
        <div className="mb-10">
          <Typography variant="h5" className="mb-4 text-gray-800 font-semibold" aria-label={editingTask ? 'Edit task form' : 'Add new task form'}>
            {editingTask ? 'Task Edit Karo' : 'Naya Task Add Karo'}
          </Typography>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="relative">
              <TextField
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                className="bg-white rounded-lg"
                InputProps={{
                  className: 'rounded-lg border-gray-300'
                }}
                disabled={loading}
                inputProps={{ 'aria-label': 'Task title input', maxLength: TITLE_MAX_LENGTH }}
                error={titleError}
                helperText={
                  titleError ? 'Task title cannot be empty' : `${formData.title.length}/${TITLE_MAX_LENGTH} characters`
                }
              />
            </div>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              className="bg-white rounded-lg"
              InputProps={{
                className: 'rounded-lg border-gray-300'
              }}
              disabled={loading}
              inputProps={{ 'aria-label': 'Task description input' }}
            />
            <div className="flex gap-4">
              <Button
                type="submit"
                variant="contained"
                color={editingTask ? 'warning' : 'primary'}
                className="mt-2 py-3 px-6 rounded-lg hover:shadow-2xl transition-shadow duration-300"
                disabled={loading}
                aria-label={editingTask ? 'Update task button' : 'Add task button'}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : (editingTask ? 'Task Update Karo' : 'Task Add Karo')}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                className="mt-2 py-3 px-6 rounded-lg hover:shadow-2xl transition-shadow duration-300"
                onClick={editingTask ? handleCancelEdit : handleClearForm}
                disabled={loading}
                aria-label={editingTask ? 'Cancel edit button' : 'Clear form button'}
                startIcon={<ClearIcon />}
              >
                {editingTask ? 'Cancel' : 'Clear Form'}
              </Button>
            </div>
          </form>
        </div>

        {/* Task List */}
        <Typography variant="h5" className="mb-4 text-gray-800 font-semibold" aria-label="Your tasks list">
          Aapke Tasks
        </Typography>
        {loading && tasks.length === 0 ? (
          <div className="flex justify-center py-4">
            <CircularProgress aria-label="Loading tasks" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <Typography variant="body1" className="text-gray-500 text-center py-4" aria-label="No tasks message">
            {searchQuery ? 'Koi tasks match nahi kare' : 'Koi tasks nahi hain. Ek task add karo!'}
          </Typography>
        ) : (
          <List className="space-y-3">
            {filteredTasks.map((task) => (
              <Fade in key={task._id} timeout={600}>
                <Paper
                  elevation={3}
                  className={`p-4 rounded-lg hover:shadow-lg transition-shadow duration-200 ${
                    task.completed ? 'bg-green-100' : 'bg-white'
                  }`}
                >
                  <ListItem
                    secondaryAction={
                      <div className="flex gap-2">
                        <Checkbox
                          checked={task.completed || false}
                          onChange={() => handleToggleComplete(task)}
                          color="success"
                          aria-label={`Toggle complete task ${task.title}`}
                          disabled={loading}
                        />
                        <IconButton
                          edge="end"
                          aria-label={`Edit task ${task.title}`}
                          onClick={() => handleEdit(task)}
                          className="text-blue-600 hover:text-blue-800"
                          disabled={loading}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label={`Delete task ${task.title}`}
                          onClick={() => deleteTask(task._id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={loading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                        >
                          {task.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" className="text-gray-600">
                            {task.description || 'Koi description nahi'}
                          </Typography>
                          <Typography variant="caption" className="text-gray-400">
                            Created: {formatDate(task.createdAt)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Paper>
              </Fade>
            ))}
          </List>
        )}
      </Paper>

      {/* Feedback Snackbar */}
      <Snackbar
        open={!!message}
        autoHideDuration={4000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseMessage} severity={message?.type || 'info'} sx={{ width: '100%' }} aria-label="Task action feedback">
          {message?.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;