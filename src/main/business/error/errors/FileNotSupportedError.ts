export default class FileNotSupportedError extends Error {
  constructor() {
    super(`
      Unsupported file format.
      `);
  }
}
