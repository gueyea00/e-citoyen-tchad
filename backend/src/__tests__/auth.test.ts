import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';

// On mock avant les importations
vi.mock('../lib/prisma.js', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

import { prisma } from '../lib/prisma.js';
import { loginAdmin } from '../controllers/auth.controller.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

vi.mock('bcrypt');
vi.mock('jsonwebtoken');

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Auth Controller', () => {
  beforeEach(() => {
    mockReset(prismaMock);
    vi.clearAllMocks();
  });

  it('should login successfully with correct credentials', async () => {
    const mockAdmin = {
      id: '1',
      email: 'admin@ministere.gov',
      mot_de_passe: 'hashed_password',
      role: 'SUPER_ADMIN',
      actif: true,
    };

    prismaMock.adminUser.findUnique.mockResolvedValue(mockAdmin as any);
    prismaMock.adminUser.update.mockResolvedValue(mockAdmin as any);
    (bcrypt.compare as any).mockResolvedValue(true);
    (jwt.sign as any).mockReturnValue('fake_token');

    const req = { body: { email: 'admin@ministere.gov', password: 'admin' } } as any;
    const res = {} as any;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);

    await loginAdmin(req, res);

    expect(prismaMock.adminUser.findUnique).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: 'fake_token'
    }));
  });

  it('should reject incorrect password', async () => {
    prismaMock.adminUser.findUnique.mockResolvedValue({ email: 'a@a.com', mot_de_passe: 'p', actif: true } as any);
    (bcrypt.compare as any).mockResolvedValue(false);

    const req = { body: { email: 'a@a.com', password: 'wrong' } } as any;
    const res = {} as any;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);

    await loginAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
