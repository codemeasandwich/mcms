module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/__tests__/e2e/'
  ]
};
