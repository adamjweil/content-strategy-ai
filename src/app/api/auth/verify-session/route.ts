// This file can be removed as we'll handle auth client-side with Firebase Auth
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  return new Response(JSON.stringify({ 
    message: 'Auth is handled client-side with Firebase Auth',
    status: 'static' 
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
} 