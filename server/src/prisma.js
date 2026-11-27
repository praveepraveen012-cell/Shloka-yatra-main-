import { PrismaClient } from '@prisma/client';

const isTest =
  process.env.NODE_ENV === 'test' ||
  process.env.npm_lifecycle_event === 'test' ||
  (process.argv[1] && process.argv[1].includes('test'));

const testDbUrl = process.env.DATABASE_URL_TEST || 'file:../prisma/test.db';

const prisma = new PrismaClient({
  datasources: isTest ? { db: { url: testDbUrl } } : undefined,
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export default prisma;
