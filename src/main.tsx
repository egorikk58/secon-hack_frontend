import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import { Toaster } from '@/components/ui/sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<App />} />
        <Route path="/register" element={<App />} />
        <Route path="*" element={<App />} />
      </Routes>
    </Router>
    <Toaster position="top-right" />
  </React.StrictMode>
);