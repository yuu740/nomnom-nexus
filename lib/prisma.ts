import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Mencegah koneksi berlipat ganda saat hot-reload di Next.js
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Fungsi untuk membuat instance Prisma baru beserta adapternya
const prismaClientSingleton = () => {
  // Hubungkan ke URL Neon milikmu
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  // Suntikkan adapter ke dalam PrismaClient
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
