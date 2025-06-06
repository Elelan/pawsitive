// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import prisma from '@/lib/prisma'; // Assuming prisma client is set up

const SESSION_COOKIE_NAME = 'pawsitive_session';

export async function GET(req: NextRequest) {
  try {
    const cookies = cookie.parse(req.headers.get('Cookie') || '');
    const sessionCookie = cookies[SESSION_COOKIE_NAME];

    if (!sessionCookie) {
      return NextResponse.json(null, { status: 200 }); // No session, return null user
    }

    // In a real app, you would verify this token/session ID against a database or JWT secret.
    // For this mock, we assume the cookie directly contains basic user info.
    // This is NOT secure for production.
    let sessionData;
    try {
        sessionData = JSON.parse(sessionCookie);
    } catch (e) {
        // Invalid cookie format, treat as no session
        return NextResponse.json(null, { status: 200 });
    }
    

    if (!sessionData || !sessionData.userId) {
      // Clear invalid cookie
      const res = NextResponse.json(null, { status: 200 });
      res.headers.set('Set-Cookie', cookie.serialize(SESSION_COOKIE_NAME, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', expires: new Date(0), path: '/', sameSite: 'lax'}));
      return res;
    }

    // Optionally, re-fetch user from DB to ensure data is fresh,
    // especially if the cookie only stores the userId.
    const user = await prisma.user.findUnique({
        where: { id: sessionData.userId },
        select: { id: true, email: true, name: true, role: true } // Select only necessary fields
    });

    if (!user) {
        // User not found in DB, clear cookie
        const res = NextResponse.json(null, { status: 200 });
        res.headers.set('Set-Cookie', cookie.serialize(SESSION_COOKIE_NAME, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', expires: new Date(0), path: '/', sameSite: 'lax'}));
        return res;
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Error fetching current user:', error);
    // In case of error, assume no user is logged in or session is invalid.
    // It's important to clear the cookie if it might be corrupted or invalid.
    const res = NextResponse.json(null, { status: 500 }); // Return null, but signal server error
    // Potentially clear cookie here too if error implies cookie problem
    // res.headers.set('Set-Cookie', cookie.serialize(SESSION_COOKIE_NAME, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', expires: new Date(0), path: '/', sameSite: 'lax'}));
    return res;
  }
}
