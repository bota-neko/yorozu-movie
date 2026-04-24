import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear both admin and viewer sessions using the correct names
  cookieStore.delete('admin_token');
  cookieStore.delete('viewer_authenticated');
  
  return NextResponse.json({ success: true });
}
