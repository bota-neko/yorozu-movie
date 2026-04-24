import AdminLayout from '@/components/admin/AdminLayout';
import VideoForm from '@/components/admin/VideoForm';

export default function NewVideoPage() {
  return (
    <AdminLayout>
      <div style={{ marginBottom: '30px' }}>
        <h1>動画の新規追加</h1>
        <p style={{ color: 'var(--text-muted)' }}>Vimeoの動画IDを入力して新しい動画を登録します。</p>
      </div>
      <VideoForm />
    </AdminLayout>
  );
}
