export default class FileNotReadableError extends Error {
  constructor(filePath: string) {
    super(`
      Error reading file ${filePath}. The file is not readable or does not exist.
      `);
  }
}
