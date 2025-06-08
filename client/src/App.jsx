import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage'; 
import Dashboard from './components/Dashboard';
import ReportManager from './components/ReportManager';

const App = () => {
  return ( 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reportManager" element={<ReportManager />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
