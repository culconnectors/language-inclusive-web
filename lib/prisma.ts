import { PrismaClient as PrismaClientCommunity } from "../.prisma/client-community";
import { PrismaClient as PrismaClientWorkshop } from "../.prisma/client-workshop";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
    communityClient: PrismaClientCommunity;
    workshopClient: PrismaClientWorkshop;
};

export const communityClient =
    globalForPrisma.communityClient || new PrismaClientCommunity();

export const workshopClient =
    globalForPrisma.workshopClient || new PrismaClientWorkshop();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.communityClient = communityClient;
    globalForPrisma.workshopClient = workshopClient;
}
