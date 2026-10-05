import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Mau2Invitation from './index';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminTrash from './admin/pages/AdminTrash';

export default function App() {
  return (
    <BrowserRouter basename="/ThoaWD">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/trash" element={<AdminTrash />} />
        <Route path="/*" element={<Mau2Invitation />} />
      </Routes>
    </BrowserRouter>
  );
}
