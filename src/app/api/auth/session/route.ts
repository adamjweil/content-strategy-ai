import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirebaseAdminApp } from '@/lib/firebase/admin';

const auth = getAuth(getFirebaseAdminApp());

// Add dynamic export for static generation
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'No ID token provided' },
        { status: 400 }
      );
    }

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json(
      { status: 'success' },
      { status: 200 }
    );

    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: Request) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export async function DELETE() {
  const response = NextResponse.json(
    { status: 'success' },
    { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  );

  response.cookies.set({
    name: 'session',
    value: '',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax' as const,
  });

  return response;
} 