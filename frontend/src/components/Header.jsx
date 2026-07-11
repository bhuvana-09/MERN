import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Noah';

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingTop: 32, paddingBottom: 0,
      background: 'transparent',
      flexShrink: 0,
    }}>
      <h1 style={{
        fontSize: 28,
        fontWeight: 800,
        color: '#111827',
        letterSpacing: '-0.5px',
        lineHeight: 1,
      }}>
        Welcome, {firstName}
      </h1>
    </header>
  );
}
