import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

// Do not unnecessarily initialize Prisma at build time if DATABASE_URL is missing
export const prisma =
  globalForPrisma.prisma ||
  (process.env.DATABASE_URL ? new PrismaClient() : ({} as PrismaClient))

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
