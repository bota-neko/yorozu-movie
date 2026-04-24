import AdminLayout from '@/components/admin/AdminLayout';
import VideoForm from '@/components/admin/VideoForm';
import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);
  if (isNaN(id)) notFound();

  const [video] = await db.select().from(videos).where(eq(videos.id, id));

  if (!video) notFound();

  return (
    <AdminLayout>
      <div style={{ marginBottom: '30px' }}>
        <h1>動画の編集</h1>
        <p style={{ color: 'var(--text-muted)' }}>動画の詳細情報を更新します。</p>
      </div>
      <VideoForm initialData={video} isEdit={true} />
    </AdminLayout>
  );
}
