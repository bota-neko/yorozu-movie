'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  className?: string;
  variant?: 'header' | 'sidebar';
}

export default function LogoutButton({ className, variant = 'header' }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const isAdminPath = window.location.pathname.startsWith('/admin');
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        // Force a full page reload to clear all state and redirect
        window.location.href = isAdminPath ? '/admin/login' : '/';
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (variant === 'sidebar') {
    return (
      <button 
        onClick={handleLogout} 
        className={className}
        style={{ 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '12px 16px',
          background: 'none',
          border: 'none',
          color: '#ef4444',
          fontWeight: 'bold',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <LogOut size={20} />
        ログアウト
      </button>
    );
  }

  return (
    <button 
      onClick={handleLogout} 
      className={className}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px', 
        padding: '6px 12px',
        background: 'var(--primary)',
        color: 'var(--accent)',
        border: 'none',
        borderRadius: 'var(--radius)',
        fontSize: '12px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
    >
      <LogOut size={14} />
      ログアウト
    </button>
  );
}
