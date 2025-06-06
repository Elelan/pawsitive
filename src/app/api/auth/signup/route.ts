
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
    console.error('Signup API error object:', error); // THIS IS THE MOST IMPORTANT LOG TO CHECK ON YOUR SERVER

    let status = 500;
    // Updated message to be more direct
    let responseMessage = 'An unexpected error occurred during signup. Please check server logs for details.';
    let fieldErrors: { [key: string]: string[] } | undefined = undefined;

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        status = 409; // Conflict
        responseMessage = 'This email address is already registered.';
        // Assuming 'target' can indicate the field. Email is usually the main unique field here.
        if (error.meta?.target && (error.meta.target as string[]).includes('email')) {
          fieldErrors = { email: [responseMessage] };
        }
        console.warn(`Signup failed due to Prisma P2002 (Unique Constraint). Email: ${validatedData?.email}. Meta: ${JSON.stringify(error.meta)}`);
      } else {
        // Other Prisma-specific errors
        responseMessage = 'A database error occurred during signup. Please check server logs for details.';
        console.error('Prisma specific error during signup:', { code: error.code, meta: error.meta, clientVersion: error.clientVersion });
      }
    } else if (error instanceof Error) {
      // For generic errors, log the message but keep client response generic for security.
      console.error('Generic error during signup:', error.message, error.stack);
      // responseMessage might remain the default "An unexpected error..."
    } else {
      // Non-Error object thrown
      console.error('A non-Error object was thrown during signup:', error);
    }

    const errorResponse: { message: string; errors?: { [key: string]: string[] } } = { message: responseMessage };
    if (fieldErrors) {
      errorResponse.errors = fieldErrors;
    }
    
    // Added log to confirm what response is being formed on the server before sending
    console.log(`Returning error response from signup API: status=${status}, body=${JSON.stringify(errorResponse)}`);
    return NextResponse.json(errorResponse, { status });
  }
}
