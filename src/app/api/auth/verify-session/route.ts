import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const session = cookies().get('session');

    if (!session) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
    return NextResponse.json({ isAuthenticated: true, user: decodedClaims }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
} 