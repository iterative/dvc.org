/* eslint-env node */

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

export default {
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.{js,ts}?$': 'babel-jest'
  },
  testPathIgnorePatterns: ['/node_modules/', '/.cache', '/public/']
}
