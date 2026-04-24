import { NextResponse } from 'next/server';
import { deleteAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  await deleteAdminSession();
  return NextResponse.redirect(new URL('/admin/login', request.url), {
    status: 303,
  });
}
