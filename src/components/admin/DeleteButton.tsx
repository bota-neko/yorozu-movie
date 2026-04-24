'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../../app/admin/page.module.css';

interface DeleteButtonProps {
  id: number;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('本当に削除しますか？')) {
      try {
        const res = await fetch(`/api/admin/videos/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          router.refresh();
        } else {
          alert('削除に失敗しました');
        }
      } catch (err) {
        alert('通信エラーが発生しました');
      }
    }
  };

  return (
    <button className={styles.deleteBtn} onClick={handleDelete} title="削除">
      <Trash2 size={18} />
    </button>
  );
}
