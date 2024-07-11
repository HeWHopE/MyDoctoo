import { prismaMock } from './prisma/prisma.mock';

jest.mock('./prisma/prisma.service.ts', () => ({
  PrismaService: jest.fn(() => prismaMock),
}));
