import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    
    const cookieStore = cookies();
    await cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  await cookieStore.delete('session');
  return NextResponse.json({ status: 'success' }, { status: 200 });
} 