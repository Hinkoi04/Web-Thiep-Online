import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InvitationPage } from './Nhi';
import { AdminLogin, AdminDashboard, AdminTrash } from './Nhi/admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/trash" element={<AdminTrash />} />
        <Route path="/*" element={<InvitationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
