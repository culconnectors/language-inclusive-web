import { PrismaClient as PrismaCommunity } from '@prisma/client-community';
import { PrismaClient as PrismaEnglish } from '@prisma/client-english';

// Define types for the global object
interface GlobalWithPrisma {
  prismaCommunity: PrismaCommunity;
  prismaEnglish: PrismaEnglish;
}

// Create or use existing Prisma clients
const globalForPrisma = global as unknown as GlobalWithPrisma;

// Community events client
export const prismaCommunity = globalForPrisma.prismaCommunity || new PrismaCommunity();

// English courses client
export const prismaEnglish = globalForPrisma.prismaEnglish || new PrismaEnglish();

// Store instances in global object in development to prevent multiple instances during hot reloads
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaCommunity = prismaCommunity;
  globalForPrisma.prismaEnglish = prismaEnglish;
}

// Export a default object with both clients for convenience
const prisma = {
  community: prismaCommunity,
  english: prismaEnglish
};

export default prisma;