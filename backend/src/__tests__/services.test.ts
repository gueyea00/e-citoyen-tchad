import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';

// On mock avant l'importation du contrôleur
vi.mock('../lib/prisma.js', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

import { prisma } from '../lib/prisma.js';
import { getServices } from '../controllers/services.controller.js';

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Services Controller', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  it('should return all services', async () => {
    const mockServices = [
      { id: '1', titre_fr: 'Service 1', slug: 'service-1', direction_id: 'd1' },
    ];

    prismaMock.service.findMany.mockResolvedValue(mockServices as any);

    const req = { query: {} } as any;
    const res = {} as any;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);

    await getServices(req, res);

    expect(prismaMock.service.findMany).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockServices);
  });
});
