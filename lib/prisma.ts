import { PrismaClient as PrismaClientCommunity } from "../.prisma/client-community";
import { PrismaClient as PrismaClientWorkshop } from "../.prisma/client-workshop";
import { PrismaClient as PrismaClientLga } from "../.prisma/client-lga";
import { PrismaClient as PrismaClientLandmark } from "../.prisma/client-landmarks";
// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
    communityClient: PrismaClientCommunity;
    workshopClient: PrismaClientWorkshop;
    lgaClient: PrismaClientLga;
    landmarkClient: PrismaClientLandmark;
};

export const communityClient =
    globalForPrisma.communityClient || new PrismaClientCommunity();

export const workshopClient =
    globalForPrisma.workshopClient || new PrismaClientWorkshop();

export const lgaClient =
    globalForPrisma.lgaClient || new PrismaClientLga();

export const landmarkClient =
    globalForPrisma.landmarkClient || new PrismaClientLandmark();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.communityClient = communityClient;
    globalForPrisma.workshopClient = workshopClient;
    globalForPrisma.lgaClient = lgaClient;
}
