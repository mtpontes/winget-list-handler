class Constants {
  static UTF_8 = 'utf8'
  static BARRA = '/'
  static FOLDER_RESULT_PATH = './arquivos_gerados'
  static TXT_FILE_NAME = 'winget_lista.txt'
  static TXT_BASE_FILE_PATH = './'
  static CAMINHO_DO_ARQUIVO_DE_APPS_COM_PACOTES_GERADO = './arquivos_gerados/apps-com-pacotes.json'
  static ARQUIVO_BAT = 'exec.bat'
}

class FormatoDeArquivo {
  static JSON = '.json'
}

class TipoProcessamento {
  static COM_PACKAGE = 'apps-com-pacotes'
  static PREJUDICADO = 'apps-prejudicados'
}

/**
 * Classe que define identificadores textuais padrão usados para categorizar dados.
 */
class IdentificadorPadraoTextual {
  /**
   * Identificador textual que representa a ausência de pacote no app.
   * 
   * Geralmente corresponde ao termo `ARP`, indicando que um aplicativo não possui um pacote completo.
   * @type {string}
   */
  static AUSENCIA_DE_PACOTE = 'ARP';

  /**
   * Identificador textual que representa pacotes prejudicados pelo caractere de elipsis (`…`) 
   * adicionado pelo winget em caso de nomes muito longos. 
   * 
   * Normalmente só se aplica a pacotes internos do Windows.
   * 
   * Indica que há algum problema ou limitação no pacote do aplicativo.
   * @type {string}
   */
  static PREJUIZO_DE_PACOTE = '…';
}

class CLIConstants {
  static GENERATE_FILES_ONLY = {
    required: '--generate-files-only'
  }

  static CONSUME_FILE_ONLY = {
    required: '--consume-file-only',
    optional: {
      ASYNC: '--async',
      ASYNC_CONCURRENCY: '--async-concurrency='
    },
  }

  static MESSAGES = {
    message_1: `
        O argumento ${CLIConstants.CONSUME_FILE_ONLY.optional.ASYNC_CONCURRENCY}
        aceita somente números de 1 a 100 após o caractere '='. Informar um valor
        numérico é obrigatório ao passar esse argumento.
        
        Exemplo de uso: node index.js ${CLIConstants.CONSUME_FILE_ONLY.optional.ASYNC_CONCURRENCY}5
      `,
    message_2: `
        Após o argumento obrigatório ${CLIConstants.CONSUME_FILE_ONLY.required} 
        é possível passar apenas um dos seguintes argumentos:
        
        ${Object.values(CLIConstants.CONSUME_FILE_ONLY.optional).join(', ')}<number>
    `
  }

  static EXAMPLE = `
    Exemplos:

      Exemplo 1: node index.js ${CLIConstants.GENERATE_FILES_ONLY.required}
      Exemplo 2: node index.js ${CLIConstants.CONSUME_FILE_ONLY.required}
      Exemplo 3: node index.js ${CLIConstants.CONSUME_FILE_ONLY.required + ' ' +
    CLIConstants.CONSUME_FILE_ONLY.optional.ASYNC}
      Exemplo 4: node index.js ${CLIConstants.CONSUME_FILE_ONLY.required + ' ' +
    CLIConstants.CONSUME_FILE_ONLY.optional.ASYNC_CONCURRENCY + 5}
    `

  static getRequiredArgs() {
    return [
      this.GENERATE_FILES_ONLY.required,
      this.CONSUME_FILE_ONLY.required
    ]
  }

  static getRequiredArgsFormatted() {
    return [
      this.GENERATE_FILES_ONLY.required,
      this.CONSUME_FILE_ONLY.required
    ].join(', ')
  }
}

module.exports = {
  Constants,
  FormatoDeArquivo,
  TipoProcessamento,
  IdentificadorPadraoTextual,
  CLIConstants
}