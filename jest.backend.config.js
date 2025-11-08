// Jest config for NestJS backend (src/**) using ts-jest
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@nestjs/testing$': '<rootDir>/src/types/jest-nest-testing-stub.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts}',
    '!src/**/?(*.)+(spec|test).ts',
    '!src/main.ts',
  ],
  coverageDirectory: 'coverage-backend',
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
};