
import { PrismaClient } from '@prisma/client';

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
