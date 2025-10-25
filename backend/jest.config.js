module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/migrations/**",
    "!src/scripts/**",
    "!src/docs/**"
  ],
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"]
};
