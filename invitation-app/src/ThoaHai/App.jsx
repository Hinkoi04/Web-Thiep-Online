import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThoaHaiInvitation from './index';

export default function App() {
  return (
    <BrowserRouter basename="/ThoaHai">
      <Routes>
        <Route path="/*" element={<ThoaHaiInvitation />} />
      </Routes>
    </BrowserRouter>
  );
}
