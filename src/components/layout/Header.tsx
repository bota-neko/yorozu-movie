import Link from 'next/link';
import LogoutButton from '../auth/LogoutButton';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <Link href="/videos" className={styles.logo}>
          <span className={styles.subTitle}>鹿児島県よろず支援拠点</span>
          <span className={styles.mainTitle}>Yラーニング</span>
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
