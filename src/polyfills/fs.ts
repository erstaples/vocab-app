// Empty fs implementation for browser
export default {
  readFileSync: () => {
    throw new Error('readFileSync is not implemented in browser environment');
  },
  // Add any other fs methods if needed
};
