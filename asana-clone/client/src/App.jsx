import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import { TaskContext } from './components/TaskContext.jsx';

const App = () => {
  const { user } = useContext(TaskContext);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
    </Router>
  );
};

export default App;