import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { validateTitle, validateVimeoId } from '@/lib/validators';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = parseInt(idParam);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, vimeoId, description, thumbnailUrl, sortOrder, isPublished } = body;

    if (title !== undefined && !validateTitle(title)) {
      return NextResponse.json({ error: 'タイトルを正しく入力してください' }, { status: 400 });
    }

    let finalVimeoId = undefined;
    if (vimeoId !== undefined) {
      const validated = validateVimeoId(vimeoId);
      if (!validated) {
        return NextResponse.json({ error: 'Vimeoの動画IDまたはURLが正しくありません' }, { status: 400 });
      }
      finalVimeoId = validated;
    }

    const [updatedVideo] = await db.update(videos)
      .set({
        ...(title !== undefined && { title }),
        ...(finalVimeoId !== undefined && { vimeoId: finalVimeoId }),
        ...(description !== undefined && { description }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isPublished !== undefined && { isPublished }),
        updatedAt: new Date(),
      })
      .where(eq(videos.id, id))
      .returning();

    if (!updatedVideo) {
      return NextResponse.json({ error: '動画が見つかりませんでした' }, { status: 404 });
    }

    return NextResponse.json(updatedVideo);
  } catch (err) {
    console.error('Update video error:', err);
    return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = parseInt(idParam);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await db.delete(videos).where(eq(videos.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
  }
}
