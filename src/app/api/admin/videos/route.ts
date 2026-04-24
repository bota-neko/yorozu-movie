import { NextResponse } from 'next/server';
import { db, videos } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { validateTitle, validateVimeoId } from '@/lib/validators';
import { desc } from 'drizzle-orm';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allVideos = await db.select().from(videos).orderBy(desc(videos.createdAt));
    return NextResponse.json(allVideos);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, vimeoId: rawVimeoId, description, thumbnailUrl, sortOrder, isPublished } = body;

    if (!validateTitle(title)) {
      return NextResponse.json({ error: 'タイトルを正しく入力してください' }, { status: 400 });
    }

    const vimeoId = validateVimeoId(rawVimeoId);
    if (!vimeoId) {
      return NextResponse.json({ error: 'Vimeoの動画IDまたはURLが正しくありません' }, { status: 400 });
    }

    const [newVideo] = await db.insert(videos).values({
      title,
      vimeoId,
      description,
      thumbnailUrl,
      sortOrder: sortOrder || 0,
      isPublished: isPublished ?? false,
    }).returning();

    return NextResponse.json(newVideo);
  } catch (err) {
    console.error('Create video error:', err);
    return NextResponse.json({ error: '動画の登録に失敗しました' }, { status: 500 });
  }
}
