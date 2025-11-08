import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import type { UsersService } from '../users/users.service';
import type { JwtService } from '@nestjs/jwt';

jest.mock('bcrypt');
// Provide a minimal runtime stub for Nest imports used by AuthService
jest.mock(
  '@nestjs/common',
  () => ({
    UnauthorizedException: class UnauthorizedException extends Error {
      constructor(message?: string) {
        super(message);
        this.name = 'UnauthorizedException';
      }
    },
  }),
  { virtual: true }
);
jest.mock(
  '@nestjs/jwt',
  () => ({
    JwtService: class JwtService {},
  }),
  { virtual: true }
);

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    service = new AuthService(
      mockUsersService as unknown as UsersService,
      mockJwtService as unknown as JwtService,
    );
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should return access token for valid credentials', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: 'CLIENT',
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.login({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toEqual({
        access_token: 'token',
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          role: 'CLIENT',
        },
      });
    });
  });
});