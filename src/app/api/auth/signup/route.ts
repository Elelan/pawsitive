
// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Role } from '@prisma/client'; // Import Role enum
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: "Validation failed", errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, password } = validation.data;

    // Check for existing user is implicitly handled by Prisma unique constraint,
    // but an explicit check can be cleaner if preferred.
    // For now, we rely on Prisma's error for this.

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.USER, // Default role
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    console.error('Signup API error:', error); // Log the full error object

    if (error instanceof PrismaClientKnownRequestError) {
      // Check for unique constraint violation (e.g., email already exists)
      if (error.code === 'P2002') {
        // The `meta.target` field can tell you which field caused the error
        const target = error.meta?.target as string[] | undefined;
        let fieldMessage = "A user with this information already exists.";
        if (target && target.includes('email')) {
            fieldMessage = 'This email address is already registered.';
        }
        return NextResponse.json({ message: fieldMessage, field: target ? target.join(', ') : 'unknown' }, { status: 409 }); // 409 Conflict
      }
    }

    // For other errors or if it's not a Prisma error we specifically handle
    let errorMessage = 'An unexpected error occurred during signup.';
    if (error instanceof Error && error.message) {
      // You might want to be careful about exposing raw error messages to the client
      // For debugging, it can be helpful, but sanitize for production.
      // errorMessage = error.message; // Potentially too verbose or sensitive for client
    }
    
    return NextResponse.json({ message: errorMessage, details: error instanceof Error ? error.toString() : 'Unknown error structure' }, { status: 500 });
  }
}
