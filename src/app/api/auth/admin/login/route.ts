import { NextResponse } from 'next/server';
import { db, admins } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { comparePassword } from '@/lib/password';
import { createAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'ユーザー名とパスワードを入力してください' }, { status: 400 });
    }

    const admin = await db.select().from(admins).where(eq(admins.username, username)).limit(1);

    if (admin.length === 0) {
      return NextResponse.json({ error: 'ユーザー名またはパスワードが正しくありません' }, { status: 401 });
    }

    const isMatch = await comparePassword(password, admin[0].passwordHash);

    if (!isMatch) {
      return NextResponse.json({ error: 'ユーザー名またはパスワードが正しくありません' }, { status: 401 });
    }

    await createAdminSession(username);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'ログイン中にエラーが発生しました' }, { status: 500 });
  }
}
