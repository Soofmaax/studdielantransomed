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
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{ts}',
    '!src/**/?(*.)+(spec|test).ts',
    '!src/main.ts'
  ],
  coverageDirectory: 'coverage-backend',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.backend.json',
      isolatedModules: true
    }
  }
};