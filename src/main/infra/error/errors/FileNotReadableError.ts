export default class FileNotReadableError extends Error {
  constructor(filePath: string) {
    super(`
      Erro ao ler arquivo ${filePath}. O arquivo não é legível ou não existe.
      `);
  }
}
