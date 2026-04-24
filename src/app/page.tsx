'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import styles from './page.module.css';

export default function HomePage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/viewer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/videos');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'パスワードが正しくありません');
      }
    } catch (err) {
      setError('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className={styles.container} style={{ flex: 1 }}>
        <div className={styles.authBox}>
          <div className={styles.header}>
            <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 'normal', marginBottom: '8px', color: 'var(--text-muted)' }}>鹿児島県よろず支援拠点</span>
              <span>Yラーニング</span>
            </h1>
            <p>閲覧にはパスワードが必要です</p>
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="password"
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? '認証中...' : '閲覧を開始する'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
