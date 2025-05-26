/**
 * @module lib/prisma
 * @description Manages Prisma client instances for different databases in the application.
 * Provides singleton instances of PrismaClient for community, workshop, LGA, and landmark databases.
 * Implements connection pooling to prevent exhausting database connections in development.
 */

import { PrismaClient as CommunityPrismaClient } from "../.prisma/client-community";
import { PrismaClient as WorkshopPrismaClient } from "../.prisma/client-workshop";
import { PrismaClient as LgaPrismaClient } from "../.prisma/client-lga";
import { PrismaClient as LandmarkPrismaClient } from "../.prisma/client-landmarks";
// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
    communityClient: CommunityPrismaClient;
    workshopClient: WorkshopPrismaClient;
    lgaClient: LgaPrismaClient;
    landmarkClient: LandmarkPrismaClient;
};

/**
 * Prisma client instance for community database
 * @type {CommunityPrismaClient}
 */
export const communityClient =
    globalForPrisma.communityClient || new CommunityPrismaClient();

/**
 * Prisma client instance for workshop database
 * @type {WorkshopPrismaClient}
 */
export const workshopClient =
    globalForPrisma.workshopClient || new WorkshopPrismaClient();

/**
 * Prisma client instance for LGA database
 * @type {LgaPrismaClient}
 */
export const lgaClient = globalForPrisma.lgaClient || new LgaPrismaClient();

/**
 * Prisma client instance for landmark database
 * @type {LandmarkPrismaClient}
 */
export const landmarkClient =
    globalForPrisma.landmarkClient || new LandmarkPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.communityClient = communityClient;
    globalForPrisma.workshopClient = workshopClient;
    globalForPrisma.lgaClient = lgaClient;
    globalForPrisma.landmarkClient = landmarkClient;
}
