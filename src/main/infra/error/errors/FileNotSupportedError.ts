export default class FileNotSupportedError extends Error {
  constructor() {
    super(`
      Formato de arquivo não suportado.
      `);
  }
}
