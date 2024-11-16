import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './component/navbar';  // Ensure correct path to Navbar
import Footer from './component/footer';  // Ensure correct path to Footer
import Login from './login';
import Dashboard from './dashboard';
import Home from './home';
import UserHome from './UserHome';

const App = () => {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/userhome" element={<UserHome />} />

        </Routes>
      </>
    </Router>
  );
};

export default App;
