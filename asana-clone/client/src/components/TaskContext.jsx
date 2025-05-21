import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchTasks = async (Id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/tasks/${Id}`);
      setTasks(response.data);
      setMessage({ type: 'success', text: 'Tasks fetched successfully!' });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setMessage({ type: 'error', text: 'Failed to fetch tasks.' });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/tasks', task);
      setTasks([...tasks, response.data]);
      setMessage({ type: 'success', text: 'Task added successfully!' });
    } catch (error) {
      console.error('Error adding task:', error);
      setMessage({ type: 'error', text: 'Failed to add task.' });
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => (task._id === id ? response.data : task)));
      setMessage({ type: 'success', text: 'Task updated successfully!' });
    } catch (error) {
      console.error('Error updating task:', error);
      setMessage({ type: 'error', text: 'Failed to update task.' });
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      setMessage({ type: 'success', text: 'Task deleted successfully!' });
    } catch (error) {
      console.error('Error deleting task:', error);
      setMessage({ type: 'error', text: 'Failed to delete task.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchTasks(user.userId);
    }
  }, [user]);

  return (
    <TaskContext.Provider value={{ user, setUser, tasks, fetchTasks, addTask, updateTask, deleteTask, loading, message, setMessage }}>
      {children}
    </TaskContext.Provider>
  );
};