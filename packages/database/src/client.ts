import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {Pool} from 'pg';
import path from "path";
import { config } from "dotenv";

config({
  path: path.resolve(process.cwd(), "../../.env"),
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}