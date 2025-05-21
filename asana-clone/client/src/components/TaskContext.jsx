import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchTasks = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
      setTasks(response.data);
      setMessage({ type: 'success', text: 'Tasks fetch ho gaye!' });
    } catch (error) {
      console.error('Tasks fetch karne mein error:', error);
      setMessage({ type: 'error', text: 'Tasks fetch nahi hue.' });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task) => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:5000/api/tasks/${task.userId}`, {
        title: task.title,
        description: task.description,
        completed: task.completed || false,
      });
      setTasks([...tasks, response.data]);
      setMessage({ type: 'success', text: 'Task add ho gaya!' });
    } catch (error) {
      console.error('Task add karne mein error:', error.message);
      setMessage({ type: 'error', text: 'Task add nahi hua.' });
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => (task._id === id ? response.data : task)));
      setMessage({ type: 'success', text: 'Task update ho gaya!' });
    } catch (error) {
      console.error('Task update karne mein error:', error.message);
      setMessage({ type: 'error', text: 'Task update nahi hua.' });
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      setMessage({ type: 'success', text: 'Task delete ho gaya!' });
    } catch (error) {
      console.error('Task delete karne mein error:', error.message);
      setMessage({ type: 'error', text: 'Task delete nahi hua.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchTasks(user._id);
    }
  }, [user]);

  return (
    <TaskContext.Provider value={{ user, setUser, tasks, fetchTasks, addTask, updateTask, deleteTask, loading, message, setMessage }}>
      {children}
    </TaskContext.Provider>
  );
};