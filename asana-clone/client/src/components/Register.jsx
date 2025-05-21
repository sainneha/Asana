import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { TaskContext } from './TaskContext.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useContext(TaskContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      setUser({ username: formData.username });
      setOpen(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center h-screen" id="reg-form">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 text-center" id='reg'>Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
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
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth className="mt-4">
            Register
          </Button>
        </form>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Registration Successful</DialogTitle>
          <DialogContent>
            <p>You have successfully registered! Click OK to proceed to login.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">OK</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Register;