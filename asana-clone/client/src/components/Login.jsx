import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { TaskContext } from './TaskContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const { setUser, fetchTasks } = useContext(TaskContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log('Login response:', response.data);
        navigate('/dashboard'); 
      setUser({ username: formData.username, userId: response.data.userId });
      await fetchTasks(response.data.userId);
       alert('Login Successful!');
        
      setOpen(true);  // Dialog open
      // <-- Temporary alert, agar dialog show na ho to use kar sakte ho
    } catch (error) {
      console.log('Login error:', error.response);
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  const handleClose = () => {
    console.log('Dialog closed, navigating to dashboard');
    setOpen(false);
    navigate('/dashboard');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent" id="log-form">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth className="mt-4">
            Login
          </Button>
        </form>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Login Successful</DialogTitle>
          <DialogContent>
            <p>You have successfully logged in! Click OK to proceed to the dashboard.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">OK</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Login;
