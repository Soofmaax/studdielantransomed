import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = testingModule.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' })
      ).rejects.toThrow(UnauthorizedException);
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