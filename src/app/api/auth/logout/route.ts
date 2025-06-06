// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import cookie from 'cookie';

const SESSION_COOKIE_NAME = 'pawsitive_session';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear the session cookie
    response.headers.set('Set-Cookie', cookie.serialize(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Set expiry to past date
      path: '/',
      sameSite: 'lax',
    }));

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred during logout.' }, { status: 500 });
  }
}
