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
    '^@/(.*)
  collectCoverageFrom: [
    '<rootDir>/{app,components,lib,hooks}/**/*.{ts,tsx}',
    '!<rootDir>/**/_*.{ts,tsx}', // ignore private modules if any
    '!<rootDir>/**/?(*.)+(stories|spec|test).{ts,tsx}',
    '!<rootDir>/**/index.{ts,tsx}',
    '!<rootDir>/lib/**/types.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
: '<rootDir>/$1',
  },
  // Ignore e2e tests from unit test run
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  collectCoverageFrom: [
    '<rootDir>/{app,components,lib,hooks}/**/*.{ts,tsx}',
    '!<rootDir>/**/_*.{ts,tsx}', // ignore private modules if any
    '!<rootDir>/**/?(*.)+(stories|spec|test).{ts,tsx}',
    '!<rootDir>/**/index.{ts,tsx}',
    '!<rootDir>/lib/**/types.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
: '&lt;rootDir&gt;/$1',
  },
  // Ignore e2e tests from unit test run
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  collectCoverageFrom: [
    '<rootDir>/{app,components,lib,hooks}/**/*.{ts,tsx}',
    '!<rootDir>/**/_*.{ts,tsx}', // ignore private modules if any
    '!<rootDir>/**/?(*.)+(stories|spec|test).{ts,tsx}',
    '!<rootDir>/**/index.{ts,tsx}',
    '!<rootDir>/lib/**/types.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
: '<rootDir>/$1',
  },
  // Ignore e2e tests from unit test run
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  collectCoverageFrom: [
    '<rootDir>/{app,components,lib,hooks}/**/*.{ts,tsx}',
    '!<rootDir>/**/_*.{ts,tsx}', // ignore private modules if any
    '!<rootDir>/**/?(*.)+(stories|spec|test).{ts,tsx}',
    '!<rootDir>/**/index.{ts,tsx}',
    '!<rootDir>/lib/**/types.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
: '<rootDir>/$1',
  },
  // Ignore e2e tests from unit test run
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  collectCoverageFrom: [
    '<rootDir>/{app,components,lib,hooks}/**/*.{ts,tsx}',
    '!<rootDir>/**/_*.{ts,tsx}', // ignore private modules if any
    '!<rootDir>/**/?(*.)+(stories|spec|test).{ts,tsx}',
    '!<rootDir>/**/index.{ts,tsx}',
    '!<rootDir>/lib/**/types.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
: '<rootDir>/$1',
  },
  // Ignore e2e tests from unit test run
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  collectCoverageFrom: [
    '<rootDir>/{app,components,lib,hooks}/**/*.{ts,tsx}',
    '!<rootDir>/**/_*.{ts,tsx}', // ignore private modules if any
    '!<rootDir>/**/?(*.)+(stories|spec|test).{ts,tsx}',
    '!<rootDir>/**/index.{ts,tsx}',
    '!<rootDir>/lib/**/types.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
: '&lt;rootDir&gt;/$1',
  },
  // Ignore e2e tests from unit test run
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  collectCoverageFrom: [
    '<rootDir>/{app,components,lib,hooks}/**/*.{ts,tsx}',
    '!<rootDir>/**/_*.{ts,tsx}', // ignore private modules if any
    '!<rootDir>/**/?(*.)+(stories|spec|test).{ts,tsx}',
    '!<rootDir>/**/index.{ts,tsx}',
    '!<rootDir>/lib/**/types.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
: '<rootDir>/$1',
  },
  // Ignore e2e tests from unit test run
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  collectCoverageFrom: [
    '<rootDir>/{app,components,lib,hooks}/**/*.{ts,tsx}',
    '!<rootDir>/**/_*.{ts,tsx}', // ignore private modules if any
    '!<rootDir>/**/?(*.)+(stories|spec|test).{ts,tsx}',
    '!<rootDir>/**/index.{ts,tsx}',
    '!<rootDir>/lib/**/types.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
