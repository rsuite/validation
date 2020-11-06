module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@rsuite/interactions": "<rootDir>/src/index.ts",
  },
};
