import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';

// On mock avant les importations
vi.mock('../lib/prisma.js', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

import { prisma } from '../lib/prisma.js';
import { generateDownloadLink } from '../controllers/documents.controller.js';
import jwt from 'jsonwebtoken';

vi.mock('jsonwebtoken');

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Documents Controller', () => {
  beforeEach(() => {
    mockReset(prismaMock);
    vi.clearAllMocks();
  });

  it('should generate a 10-minute secure download token', async () => {
    const mockDoc = { id: 'doc1', titre_fr: 'Guide PDF', fichier_url: 'path/to/file.pdf' };
    prismaMock.document.findUnique.mockResolvedValue(mockDoc as any);
    (jwt.sign as any).mockReturnValue('secure_token');

    const req = { params: { id: 'doc1' } } as any;
    const res = {} as any;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);

    await generateDownloadLink(req, res);

    expect(prismaMock.document.findUnique).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ downloadUrl: expect.stringContaining('secure_token') });
  });
});
