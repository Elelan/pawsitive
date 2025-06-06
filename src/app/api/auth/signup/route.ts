
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
  let validatedData: z.infer<typeof signupSchema> | null = null;
  try {
    const body = await req.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      console.warn('Signup validation failed:', validation.error.flatten().fieldErrors);
      return NextResponse.json({ message: "Validation failed", errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    validatedData = validation.data;
    const { name, email, password } = validatedData;
    console.log(`Attempting to register user with email: ${email} and name: ${name}`);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully.');

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
    console.error('Signup API error object:', error); 
    
    let status = 500;
    let responseMessage = 'An unexpected error occurred during signup. Please try again later.';
    let fieldErrors: { [key: string]: string[] } | undefined = undefined;

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Unique constraint violation
        status = 409; // Conflict
        responseMessage = 'This email address is already registered.';
        // Assuming 'target' can indicate the field. Email is usually the main unique field here.
        if (error.meta?.target && (error.meta.target as string[]).includes('email')) {
          fieldErrors = { email: [responseMessage] };
        }
        console.warn(`Signup failed: Prisma P2002 error (Unique Constraint). Input email (if available): ${validatedData?.email}. Meta: ${JSON.stringify(error.meta)}`);
      } else {
        // Other Prisma-specific errors
        responseMessage = 'A database error occurred during signup.';
        console.error('Prisma specific error during signup:', { code: error.code, meta: error.meta, clientVersion: error.clientVersion });
      }
    } else if (error instanceof Error) {
      // Generic Error instance
      if (error.message) {
         // Avoid sending overly technical or sensitive error messages to the client directly
         // Log the specific error.message on the server, but send a more generic one to the client for non-Prisma errors unless explicitly safe.
        console.error('Generic error message:', error.message);
        // responseMessage = error.message; // Potentially too much info for client
      }
    }
    // For other types of errors, the default responseMessage and status 500 will be used.

    const errorResponse: { message: string; errors?: { [key: string]: string[] } } = { message: responseMessage };
    if (fieldErrors) {
      errorResponse.errors = fieldErrors;
    }
    
    return NextResponse.json(errorResponse, { status });
  }
}

