import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import DeleteButton from '@/components/admin/DeleteButton';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const allVideos = await db.select().from(videos).orderBy(desc(videos.createdAt));

  return (
    <AdminLayout>
      <div className={styles.header}>
        <h1>動画管理</h1>
        <Link href="/admin/videos/new" className="btn btn-primary">
          <Plus size={18} />
          新規追加
        </Link>
      </div>

      <div className="card">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ステータス</th>
              <th>タイトル</th>
              <th>Vimeo ID</th>
              <th>表示順</th>
              <th>登録日</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {allVideos.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                  登録された動画はありません
                </td>
              </tr>
            ) : (
              allVideos.map((video) => (
                <tr key={video.id}>
                  <td>
                    {video.isPublished ? (
                      <span className="badge badge-success">公開中</span>
                    ) : (
                      <span className="badge badge-error">非公開</span>
                    )}
                  </td>
                  <td className={styles.titleCell}>{video.title}</td>
                  <td>{video.vimeoId}</td>
                  <td>{video.sortOrder}</td>
                  <td>{new Date(video.createdAt).toLocaleDateString('ja-JP')}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/videos/${video.id}`} target="_blank" title="表示を確認">
                        <ExternalLink size={18} />
                      </Link>
                      <Link href={`/admin/videos/${video.id}/edit`} title="編集">
                        <Edit2 size={18} />
                      </Link>
                      <DeleteButton id={video.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
