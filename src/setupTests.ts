import '@testing-library/jest-dom';

// Polyfill for TextEncoder and TextDecoder for Jest environment
// This is a common workaround for environments where these are not globally available (like older Node.js versions in JSDOM)
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder } = require('util');
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  const { TextDecoder } = require('util');
  global.TextDecoder = TextDecoder;
}