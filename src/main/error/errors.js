const { CLIConstants, TipoProcessamento } = require('../constants/constants')

class ArgumentError extends Error { constructor(message) { super(message) } }

class ArgumentNotSupportedError extends Error {
  constructor(argumentosNaoSuportados) {
    const message = `
      Argumentos não suportados: ' + ${argumentosNaoSuportados.join(', ')}
    `
    super(message)
  }
}

class MultipleArgumentsError extends Error { constructor(message) { super(message) } }

class RequiredArgumentError extends Error {
  constructor() {
    const message = `
      Argumento obrigatório inválido ou ausente. Informe um argumento válido.

      Argumentos obrigatórios: ${CLIConstants.getRequiredArgsFormatted()}
      
      Só é possível usar um dos argumentos obrigatórios e ele sempre deve ser o primeiro argumento a ser passado.
    `
    super(message);
  }
}

class InvalidJsonFormat extends Error {
  constructor() {
    super(`
        Formato inválido: esperado um array de pacotes. Corrija a formatação do
        arquivo ${TipoProcessamento.COM_PACKAGE}.json ou rode o fluxo de geração 
        de arquivos novamente.
      `);
  }
}

class FileNotReadableError extends Error {
  constructor(filePath) {
    super(`
      Erro ao ler arquivo ${filePath}. O arquivo não é legível ou não existe.
      `);
  }
}

class FileNotSupportedError extends Error {
  constructor() {
    super(`
      Formato de arquivo não suportado.
      `);
  }
}

module.exports = {
  ArgumentError,
  ArgumentNotSupportedError,
  MultipleArgumentsError,
  RequiredArgumentError,
  FileNotReadableError,
  FileNotSupportedError,
  InvalidJsonFormat
}