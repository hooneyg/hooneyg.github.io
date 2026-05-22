import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#0a0a0c',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', color: '#10b981' }}>404</h1>
      <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>요청하신 페이지를 찾을 수 없습니다.</p>
      <Link href="/" style={{
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'all 0.2s ease'
      }}>
        메인으로 돌아가기
      </Link>
    </div>
  );
}
