
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.USER, // Default role
      },
    });

    const { password: _removedPassword, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    // Log the full error object for detailed debugging on the server
    console.error('Signup API error:', error); 

    if (error instanceof PrismaClientKnownRequestError) {
      // Check for unique constraint violation (e.g., email already exists)
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[] | undefined;
        let fieldMessage = 'This email address is already registered.';
        // if (target && target.includes('email')) { // This check is a bit redundant if P2002 on User.email is the only unique constraint
        //     fieldMessage = 'This email address is already registered.';
        // }
        return NextResponse.json({ message: fieldMessage, field: 'email' }, { status: 409 }); // 409 Conflict
      }
    }

    // For other errors or if it's not a Prisma error we specifically handle
    let errorMessage = 'An unexpected error occurred during signup.';
    // Avoid exposing raw error messages to the client in production for security
    // if (error instanceof Error && process.env.NODE_ENV === 'development') {
    //   errorMessage = error.message; 
    // }
    
    return NextResponse.json({ message: errorMessage, details: error instanceof Error ? error.toString() : 'Unknown error structure' }, { status: 500 });
  }
}
