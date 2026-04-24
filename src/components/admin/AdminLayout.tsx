import Link from 'next/link';
import { LayoutDashboard, Video, Settings, LogOut } from 'lucide-react';
import LogoutButton from '../auth/LogoutButton';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 'normal', color: 'var(--text-muted)', marginBottom: '2px' }}>鹿児島県よろず支援拠点</span>
            <span style={{ fontSize: '18px' }}>Yラーニング</span>
            <span style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>管理画面</span>
          </h2>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            <Video size={20} />
            動画管理
          </Link>
          <Link href="/admin/settings" className={styles.navLink}>
            <Settings size={20} />
            設定
          </Link>
          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <LogoutButton variant="sidebar" />
          </div>
        </nav>
      </aside>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
