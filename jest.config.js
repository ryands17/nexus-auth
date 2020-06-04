const path = require('path')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: path.join(__dirname, 'prisma', 'prisma-test-environment.js'),
  testMatch: ['**/__tests__/**/*.{test,spec}.(ts|js)'],
}
