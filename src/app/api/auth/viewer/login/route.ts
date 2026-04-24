import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { comparePassword } from '@/lib/password';
import { setViewerAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'パスワードを入力してください' }, { status: 400 });
    }

    const config = await db.select().from(settings).limit(1);

    if (config.length === 0) {
      return NextResponse.json({ error: 'システム設定が見つかりません。管理者に連絡してください。' }, { status: 500 });
    }

    const isMatch = await comparePassword(password, config[0].viewerPasswordHash);

    if (!isMatch) {
      return NextResponse.json({ error: 'パスワードが正しくありません' }, { status: 401 });
    }

    await setViewerAuthenticated(config[0].viewerPasswordHash);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Viewer login error:', err);
    return NextResponse.json({ error: '認証中にエラーが発生しました' }, { status: 500 });
  }
}
