'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface VideoFormProps {
  initialData?: {
    id?: number;
    title: string;
    vimeoId: string;
    description: string | null;
    thumbnailUrl: string | null;
    sortOrder: number | null;
    isPublished: boolean | null;
  };
  isEdit?: boolean;
}

export default function VideoForm({ initialData, isEdit }: VideoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    vimeoId: initialData?.vimeoId || '',
    description: initialData?.description || '',
    thumbnailUrl: initialData?.thumbnailUrl || '',
    sortOrder: initialData?.sortOrder || 0,
    isPublished: initialData?.isPublished ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = isEdit ? `/api/admin/videos/${initialData?.id}` : '/api/admin/videos';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || '保存に失敗しました');
      }
    } catch (err) {
      setError('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const fetchVimeoInfo = async () => {
    if (!formData.vimeoId) {
      setError('Vimeo動画IDを入力してください');
      return;
    }

    setIsFetching(true);
    setError('');

    try {
      // Use Vimeo oEmbed API (does not require API key for public videos)
      const res = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${formData.vimeoId}`);
      
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({
          ...prev,
          title: prev.title || data.title || '',
          description: prev.description || data.description || '',
          thumbnailUrl: data.thumbnail_url || prev.thumbnailUrl,
        }));
      } else {
        setError('Vimeoから情報を取得できませんでした。動画IDが正しいか、または動画が公開設定になっているか確認してください。');
      }
    } catch (err) {
      setError('Vimeo情報の取得中にエラーが発生しました');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px' }}>
      {error && <p style={{ color: 'var(--error)', marginBottom: '20px' }}>{error}</p>}
      
      <div className="input-group">
        <label>タイトル *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="input-group">
        <label>Vimeo動画ID *</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={formData.vimeoId}
            onChange={(e) => setFormData({ ...formData, vimeoId: e.target.value })}
            required
            placeholder="例: 123456789"
            style={{ flex: 1 }}
          />
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={fetchVimeoInfo}
            disabled={isFetching || !formData.vimeoId}
            style={{ whiteSpace: 'nowrap' }}
          >
            {isFetching ? '取得中...' : '情報を取得'}
          </button>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          IDを入力して「情報を取得」を押すと、タイトルとサムネイルが自動入力されます。
        </p>
      </div>

      <div className="input-group">
        <label>説明文</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="input-group">
        <label>サムネイル画像</label>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {(formData.thumbnailUrl || initialData?.thumbnailUrl) && (
            <img 
              src={formData.thumbnailUrl || initialData?.thumbnailUrl || ''} 
              alt="Preview" 
              style={{ width: '120px', height: '67.5px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} 
            />
          )}
          <div style={{ flex: 1 }}>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                
                setLoading(true);
                try {
                  const res = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: uploadFormData,
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setFormData({ ...formData, thumbnailUrl: data.url });
                  } else {
                    alert(data.error || 'アップロードに失敗しました');
                  }
                } catch (err) {
                  alert('アップロード中にエラーが発生しました');
                } finally {
                  setLoading(false);
                }
              }}
              style={{ marginBottom: '10px' }}
            />
            <div className="input-group" style={{ marginBottom: 0 }}>
              <input
                type="text"
                placeholder="または画像のURLを直接入力"
                value={formData.thumbnailUrl || ''}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Vimeoの標準画像以外を使用したい場合に有効です。<br />
              Vercel Blobを使用して本番環境でもアップロードが可能です。
            </p>
          </div>
        </div>
      </div>

      <div className="input-group">
        <label>表示順</label>
        <input
          type="number"
          value={formData.sortOrder}
          onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
        />
      </div>

      <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
          style={{ width: 'auto' }}
        />
        <label htmlFor="isPublished" style={{ marginBottom: 0 }}>公開する</label>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '保存中...' : '保存する'}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => router.back()}>
          キャンセル
        </button>
      </div>
    </form>
  );
}
