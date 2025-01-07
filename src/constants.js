class Constants {
  static FOLDER_RESULT_PATH = './testando'
  static FORMATOS_DE_ARQUIVO = { json: '.json', txt: '.txt' }
  static BASE_FILE_PATH = './arquivo_gerado.txt'
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

module.exports = { Constants, TipoProcessamento, IdentificadorPadraoTextual }