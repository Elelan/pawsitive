
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
  console.log('Signup API endpoint hit. Processing request...');
  try {
    const body = await req.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      console.warn('Signup validation failed:', validation.error.flatten().fieldErrors);
      return NextResponse.json({ message: "Validation failed", errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, password } = validation.data;
    console.log(`Attempting to register user with email: ${email} and name: ${name}`);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully.');

    // Test DB connection (optional, Prisma connects lazily)
    // try {
    //   await prisma.$connect(); // Explicitly connect
    //   console.log("Successfully connected to database for signup.");
    //   await prisma.$disconnect(); // Disconnect after test
    // } catch (dbConnectError) {
    //   console.error("Initial database connection test failed in signup:", dbConnectError);
    //   return NextResponse.json({ message: "Database connection error.", details: (dbConnectError as Error).message }, { status: 500 });
    // }


    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.USER, // Default role
      },
    });
    console.log(`User ${email} created successfully with ID: ${user.id}`);

    const { password: _removedPassword, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    // Log the full error object for detailed debugging on the server
    console.error('Signup API error:', error); 

    if (error instanceof PrismaClientKnownRequestError) {
      // Check for unique constraint violation (e.g., email already exists)
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[] | undefined;
        let fieldMessage = 'An unexpected unique constraint error occurred.';
        if (target && target.includes('email')) {
            fieldMessage = 'This email address is already registered.';
        }
        console.warn(`Signup failed: Unique constraint violation for email ${ (error.meta?.target as string[])?.includes('email') ? (JSON.parse(req.url).email) : 'unknown field' }.`);
        return NextResponse.json({ message: fieldMessage, field: 'email' }, { status: 409 }); // 409 Conflict
      }
       // Log other Prisma-specific errors
       console.error('Prisma specific error during signup:', { code: error.code, meta: error.meta, clientVersion: error.clientVersion });
    }

    // For other errors or if it's not a Prisma error we specifically handle
    let errorMessage = 'An unexpected error occurred during signup.';
    let errorDetails = 'Unknown error structure';
    if (error instanceof Error) {
        errorMessage = error.message;
        errorDetails = JSON.stringify({ name: error.name, message: error.message, stack: error.stack }, null, 2);
    }
    
    return NextResponse.json({ message: errorMessage, details: errorDetails }, { status: 500 });
  }
}
