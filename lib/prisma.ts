import { PrismaClient as PrismaCommunity } from "@prisma/client-community";
import { PrismaClient as PrismaEnglish } from "@prisma/client-workshop";

const globalForPrisma = globalThis as unknown as {
    prismaCommunity: PrismaCommunity | undefined;
    prismaEnglish: PrismaEnglish | undefined;
};

export const prismaCommunity =
    globalForPrisma.prismaCommunity ?? new PrismaCommunity();
export const prismaEnglish =
    globalForPrisma.prismaEnglish ?? new PrismaEnglish();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prismaCommunity = prismaCommunity;
    globalForPrisma.prismaEnglish = prismaEnglish;
}
