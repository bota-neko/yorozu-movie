import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import VideoCard from '@/components/vimeo/VideoCard';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function VideoListPage() {
  const publishedVideos = await db.select()
    .from(videos)
    .where(eq(videos.isPublished, true))
    .orderBy(asc(videos.sortOrder), asc(videos.createdAt));

  return (
    <div className="container section">
      <header className={styles.header}>
        <p className="fade-in">{publishedVideos.length} 本の動画が公開されています</p>
      </header>

      <div className={styles.grid}>
        {publishedVideos.length === 0 ? (
          <p className={styles.empty}>動画はまだ登録されていません。</p>
        ) : (
          publishedVideos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              description={video.description}
              vimeoId={video.vimeoId}
              thumbnailUrl={video.thumbnailUrl}
            />
          ))
        )}
      </div>
    </div>
  );
}
