import { db, admins, settings } from '@/lib/db';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { comparePassword, hashPassword } from '@/lib/password';
import { createAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'ユーザー名とパスワードを入力してください' }, { status: 400 });
    }

    let admin = await db.select().from(admins).where(eq(admins.username, username)).limit(1);

    // Auto-initialize if no admins exist (for first-time Vercel deployment)
    if (admin.length === 0) {
      const allAdmins = await db.select().from(admins).limit(1);
      if (allAdmins.length === 0) {
        const defaultUser = process.env.ADMIN_USERNAME || 'yorozu-admin';
        const defaultPass = process.env.ADMIN_PASSWORD || '25y5c4c26cf2';
        
        if (username === defaultUser && password === defaultPass) {
          const hash = await hashPassword(defaultPass);
          await db.insert(admins).values({ username: defaultUser, passwordHash: hash });
          
          // Also init settings if empty
          const settingsCount = await db.select().from(settings).limit(1);
          if (settingsCount.length === 0) {
            const viewerPass = process.env.INITIAL_VIEWER_PASSWORD || 'viewer123';
            const viewerHash = await hashPassword(viewerPass);
            await db.insert(settings).values({ viewerPasswordHash: viewerHash });
          }
          
          await createAdminSession(defaultUser);
          return NextResponse.json({ success: true });
        }
      }
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
