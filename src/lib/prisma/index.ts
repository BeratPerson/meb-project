import { PrismaClient } from '@prisma/client';

declare global { var prisma: PrismaClient | undefined }

const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;

// Placeholder functions for profiles - to be implemented
export async function getBursiyerProfile(userId: string) {
  return { profile: null };
}

export async function getMentorProfile(userId: string) {
  return { profile: null };
}