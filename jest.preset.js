const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  setupFiles: ['./jest.polyfills.js'],
  testPathIgnorePatterns: ['<rootDir>/src/environments/'],
  transformIgnorePatterns: [
    'node_modules/?!d3-(selection|axis|scale|format|array|shape)',
    'node_modules/?!d3',
  ],
  moduleNameMapper: {
    d3: 'node_modules/d3/dist/d3.min.js',
  },
  async setup() {
    await super.setup();
  },
};
