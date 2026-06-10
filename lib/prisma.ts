import { PrismaClient } from '@prisma/client'

// Mencegah koneksi berlipat ganda saat hot-reload di Next.js
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma