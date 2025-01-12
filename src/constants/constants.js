class Constants {
  static FOLDER_RESULT_PATH = './arquivos_gerados'
  static BASE_FILE_PATH = './winget_lista.txt'
  static CAMINHO_DO_ARQUIVO_DE_APPS_COM_PACOTES_GERADO = '../../arquivos_gerados/apps-com-pacotes.json'
  static CAMINHO_ARQUIVO_BAT = '../exec.bat'
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

class CliArguments {
  static GENERATE_FILES_ONLY = '--generate-files-only'
  static CONSUME_FILE_ONLY = '--consume-file-only'
  static IS_ASYNC_TRUE = '--is-async=true'
  static IS_ASYNC_FALSE = '--is-async=false'
}

module.exports = {
  Constants,
  FormatoDeArquivo,
  TipoProcessamento,
  IdentificadorPadraoTextual,
  CliArguments
}