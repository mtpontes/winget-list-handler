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
      Argumento inválido.
      Argumentos permitidos: ${CliArguments.CONSUME_FILE_ONLY}, ${CliArguments.GENERATE_FILES_ONLY}
      `);
    this.name = this.constructor.name;
    this.stack = (new Error()).stack;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}

class InvalidProcessingError extends Error {
  constructor() {
    super(`
      Tipo de processamento invalido
      `);
    this.name = this.constructor.name;
    this.stack = (new Error()).stack;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}

class FileNotFoundError extends Error {
  constructor() {
    super(`
      Não foi possivel encontrar o arquivo apps-com-pacotes.json. 
      Certifique-se de já ter criado o arquivo anteriormente.
      `);
    this.name = this.constructor.name;
    this.stack = (new Error()).stack;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}

class FileNotReadableError extends Error {
  constructor() {
    super(`
      Erro ao ler arquivo
      `);
    this.name = this.constructor.name;
    this.stack = (new Error()).stack;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}

module.exports = { MultipleArgumentsError, ArgumentNotFoundError, InvalidProcessingError, FileNotReadableError, FileNotFoundError }