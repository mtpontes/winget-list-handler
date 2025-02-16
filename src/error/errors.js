const { CliArguments } = require('../constants/constants')

class MultipleArgumentsError extends Error {
  constructor() {
    super(`
      Multiplos argumentos não suportado. Passe apenas um argumento.
      Uso: node index.js <seu-argumento-aqui>
      `);
    this.name = this.constructor.name;
    this.stack = (new Error()).stack;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}

class ArgumentNotFoundError extends Error {
  constructor() {
    super(`
      Argumento inválido ou ausente. Informe um argumento válido.
      Argumentos permitidos: ${CliArguments.GENERATE_FILES_ONLY}, ${CliArguments.CONSUME_FILE_ONLY}
      `);
    this.name = this.constructor.name;
    this.stack = (new Error()).stack;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}

class FileNotReadableError extends Error {
  constructor(filePath) {
    super(`
      Erro ao ler arquivo ${filePath}. O arquivo não é legível ou não existe.
      `);
    this.name = this.constructor.name;
    this.stack = (new Error()).stack;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}

class FileNotSupportedError extends Error {
  constructor() {
    super(`
      Formato de arquivo não suportado.
      `);
    this.name = this.constructor.name;
    this.stack = (new Error()).stack;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}

module.exports = {
  MultipleArgumentsError,
  ArgumentNotFoundError,
  FileNotReadableError,
  FileNotSupportedError
}