
import { PrismaClient } from '@prisma/client';

// Check for DATABASE_URL at the very beginning
if (!process.env.DATABASE_URL) {
  console.error("ERROR: Environment variable DATABASE_URL is not defined. Prisma cannot connect to the database.");
  throw new Error(
    'Critical Error: DATABASE_URL environment variable is not set. Please define it in your .env.local file and restart the server. Refer to Prisma documentation for connection string format.'
  );
}

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prismaInstance = new PrismaClient({
    // log: ['error', 'warn'], // Consider more logs for debugging if needed
  });
  console.log("Prisma Client initialized for production.");
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      // log: ['query', 'info', 'warn', 'error'], // More verbose logging in development
    });
    console.log("New Prisma Client instance created for development.");
  }
  prismaInstance = global.prisma;
  console.log("Using existing or new Prisma Client instance for development.");
}

export default prismaInstance;
