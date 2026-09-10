import React from 'react';

export default function App() {
  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Hệ Thống Thiệp Mời</h1>
      <p>Chọn một thiệp để xem:</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <a href="/Nhi/" style={cardStyle}>
          <h2>Thiệp của Nhi</h2>
          <p>Xem thư mời tốt nghiệp</p>
        </a>
      </div>
    </div>
  );
}

const cardStyle = {
  display: 'block',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#333',
  width: '200px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};
