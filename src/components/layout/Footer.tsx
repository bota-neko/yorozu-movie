import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.copyright}>
          &copy; {year} 鹿児島県よろず支援拠点 Yラーニング. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
