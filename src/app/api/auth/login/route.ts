// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import cookie from 'cookie';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

// In a real app, use a strong, unguessable secret and store it in environment variables
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-super-secret-and-long-session-key-for-dev';
const SESSION_COOKIE_NAME = 'pawsitive_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Simple mock session: store user ID in a cookie
    // In a real app, this would be a JWT or a session ID linked to a server-side store.
    const sessionData = { userId: user.id, role: user.role, email: user.email, name: user.name }; 
    
    const response = NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

    // Set an httpOnly cookie to simulate a session
    response.headers.set('Set-Cookie', cookie.serialize(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    }));
    
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
