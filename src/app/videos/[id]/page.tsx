import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import VimeoPlayer from '@/components/vimeo/VimeoPlayer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);
  if (isNaN(id)) notFound();

  const [video] = await db.select()
    .from(videos)
    .where(eq(videos.id, id));

  if (!video || !video.isPublished) notFound();

  return (
    <div className="container section">
      <div className={styles.backWrapper}>
        <Link href="/videos" className={styles.backLink}>
          <ArrowLeft size={20} />
          一覧へ戻る
        </Link>
      </div>

      <div className={styles.playerWrapper}>
        <VimeoPlayer vimeoId={video.vimeoId} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{video.title}</h1>
        {video.description && (
          <div className={styles.description}>
            {video.description.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
