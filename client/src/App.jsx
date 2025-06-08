import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ReportManager from './components/ReportManager';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';  

// 👇 AppBar แยกเป็น Component เพื่อเรียกใช้งานเฉพาะหลัง login
const TopAppBar = ({ onLogout }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar> 
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ระบบรายงาน
          </Typography>
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false); 
    window.location.href = '/'; // redirect to login
  };

  return (
    <BrowserRouter>
      {isLoggedIn && <TopAppBar onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reportManager" element={<ReportManager />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
