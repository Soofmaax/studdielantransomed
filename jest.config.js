// Jest configuration for Next.js + TypeScript project
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  // Look for tests in __tests__ with .test or .spec extensions
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Ignore e2e tests from unit test run
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
};

module.exports = createJestConfig(customJestConfig);