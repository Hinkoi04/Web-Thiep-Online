import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThoaHaiInvitation from './index';
import ThoaHaiAdmin from './admin/ThoaHaiAdmin';

export default function App() {
  return (
    <BrowserRouter basename="/ThoaHai">
      <Routes>
        <Route path="/admin" element={<ThoaHaiAdmin />} />
        <Route path="/admin/*" element={<ThoaHaiAdmin />} />
        <Route path="/*" element={<ThoaHaiInvitation />} />
      </Routes>
    </BrowserRouter>
  );
}

