import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
// Provide a minimal runtime stub for Nest imports used by AuthService
jest.mock('@nestjs/common', () => ({
  UnauthorizedException: class UnauthorizedException extends Error {
    constructor(message?: string) {
      super(message);
      this.name = 'UnauthorizedException';
    }
  },
}));
jest.mock('@nestjs/jwt', () => ({
  JwtService: class JwtService {},
}));

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
      mockUsersService as any,
      mockJwtService as any,
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