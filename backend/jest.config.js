export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/__tests__/**/*.spec.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'server.js',
    'database.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
