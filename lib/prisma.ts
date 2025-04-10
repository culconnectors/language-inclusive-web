import { PrismaClient as PrismaCommunity } from "@prisma/client-community";
import { PrismaClient as PrismaEnglish } from "@prisma/client-workshop";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaCommunity | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaCommunity();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
