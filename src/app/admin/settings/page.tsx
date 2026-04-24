'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function SettingsPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ viewerPassword: password }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: '閲覧パスワードを更新しました' });
        setPassword('');
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || '更新に失敗しました' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '通信エラーが発生しました' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: '30px' }}>
        <h1>設定</h1>
        <p style={{ color: 'var(--text-muted)' }}>サイト全体の共通閲覧パスワードを変更します。</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          {message.text && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '4px', 
              marginBottom: '20px',
              backgroundColor: message.type === 'success' ? 'rgba(0, 200, 81, 0.1)' : 'rgba(255, 51, 51, 0.1)',
              color: message.type === 'success' ? 'var(--success)' : 'var(--error)',
              fontSize: '14px'
            }}>
              {message.text}
            </div>
          )}

          <div className="input-group">
            <label>新しい閲覧パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              placeholder="4文字以上で入力"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '更新中...' : 'パスワードを変更する'}
          </button>
        </form>
        
        <div style={{ marginTop: '30px', padding: '15px', background: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
          <h4 style={{ marginBottom: '10px' }}>現在のパスワードについて</h4>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            パスワードはハッシュ化されて保存されるため、ここから確認することはできません。
            忘れた場合は新しいパスワードを再設定してください。
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
