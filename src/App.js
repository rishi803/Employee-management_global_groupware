import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Users from './components/Users';
import './App.css'


axios.interceptors.response.use(
  (response) => response, // Pass through if response is successful
  (error) => {
    if (error.response && error.response.status === 401) {
    
      localStorage.removeItem('token'); 
      alert('Session expired. Please log in again.');
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
