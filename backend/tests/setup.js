// Test setup file
process.env.NODE_ENV = 'test';
process.env.NASA_API_KEY = 'test-api-key';
process.env.PORT = '5002'; // Use different port for testing

// Mock console.log to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
