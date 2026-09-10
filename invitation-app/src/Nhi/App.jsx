import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InvitationPage } from '.';
import { AdminLogin, AdminDashboard, AdminTrash } from './admin';

export default function App() {
  return (
    <BrowserRouter basename="/Nhi">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/trash" element={<AdminTrash />} />
        <Route path="/*" element={<InvitationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
