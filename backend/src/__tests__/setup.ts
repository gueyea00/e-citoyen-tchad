import { PrismaClient } from '@prisma/client';
import { beforeEach, vi } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

// On utilise vi.mock pour remplacer l'instance réelle de Prisma par le mock dans tout le projet
vi.mock('../lib/prisma.js', () => ({
  prisma: mockDeep<PrismaClient>(),
  default: mockDeep<PrismaClient>(),
}));

import { prisma } from '../lib/prisma.js';

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
