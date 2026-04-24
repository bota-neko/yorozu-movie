import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');
const ADMIN_TOKEN_NAME = 'admin_token';
const VIEWER_TOKEN_NAME = 'viewer_authenticated';

export async function createAdminSession(username: string) {
  const token = await new SignJWT({ username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_TOKEN_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { username: string; role: string };
  } catch (err) {
    return null;
  }
}

export async function setViewerAuthenticated(passwordHash: string) {
  const cookieStore = await cookies();
  // We store the current password hash to invalidate if it changes
  cookieStore.set(VIEWER_TOKEN_NAME, passwordHash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function isViewerAuthenticated(currentPasswordHash: string) {
  const cookieStore = await cookies();
  const storedHash = cookieStore.get(VIEWER_TOKEN_NAME)?.value;
  return storedHash === currentPasswordHash;
}

export async function clearViewerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(VIEWER_TOKEN_NAME);
}
