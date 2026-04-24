import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { validatePassword } from '@/lib/validators';

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { viewerPassword } = await request.json();

    if (!validatePassword(viewerPassword)) {
      return NextResponse.json({ error: 'パスワードは4文字以上で入力してください' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(viewerPassword);

    // Assuming there's only one row in settings
    const existingSettings = await db.select().from(settings).limit(1);

    if (existingSettings.length === 0) {
      await db.insert(settings).values({
        viewerPasswordHash: hashedPassword,
      });
    } else {
      await db.update(settings).set({
        viewerPasswordHash: hashedPassword,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update settings error:', err);
    return NextResponse.json({ error: '設定の更新に失敗しました' }, { status: 500 });
  }
}
