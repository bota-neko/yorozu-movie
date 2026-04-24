import Link from 'next/link';
import styles from './VideoCard.module.css';

interface VideoCardProps {
  id: number;
  title: string;
  description?: string | null;
  vimeoId: string;
  thumbnailUrl?: string | null;
}

export default function VideoCard({ id, title, description, vimeoId, thumbnailUrl }: VideoCardProps) {
  // Clean ID for thumbnail (remove ?h=hash if present)
  const cleanId = vimeoId.split('?')[0];
  const thumb = thumbnailUrl || `https://vumbnail.com/${cleanId}.jpg`;

  return (
    <Link href={`/videos/${id}`} className={styles.card}>
      <div className={styles.thumbnailWrapper}>
        <img src={thumb} alt={title} className={styles.thumbnail} />
        <div className={styles.playButton}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#000000">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </Link>
  );
}
