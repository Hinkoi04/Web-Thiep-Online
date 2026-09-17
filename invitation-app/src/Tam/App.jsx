import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GraduationInvitation from './GraduationInvitation.jsx';
import { AdminLogin, AdminDashboard, AdminTrash } from './admin';

export default function App() {
  return (
    <BrowserRouter basename="/Tam">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/trash" element={<AdminTrash />} />
        <Route path="/*" element={<GraduationInvitation />} />
      </Routes>
    </BrowserRouter>
  );
}

