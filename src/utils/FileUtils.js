const fs = require('fs');
const shelljs = require('shelljs');
const { Constants, TipoProcessamento, FormatoDeArquivo } = require('../constants/constants');

/**
 * Classe de utilidade para lidar com operações de arquivo relacionadas ao manipulador da lista do Winget.
 */
class FileUtils {

  /**
   * Cria o diretório para despejar arquivos de saída se ainda não existir.
   */
  static criarPastaDeDespejo() {
    const path = Constants.FOLDER_RESULT_PATH
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
  }

  /**
   * Gera um arquivo que contém a lista de aplicativos instalados usando o Winget.
   * A saída é salva no caminho do arquivo base definido nas constantes.
   */
  static geraArquivoDoWinget() {
    shelljs.exec(`winget list > ${Constants.TXT_FILE_NAME}`);
  }

  /**
   * Lê o arquivo de saída Winget e retorna seu conteúdo como uma string.
   * 
   * @returns {string} O conteúdo do arquivo de saída Winget.
   */
  static readWingetListFile() {
    return fs.readFileSync(Constants.TXT_BASE_FILE_PATH.concat(Constants.TXT_FILE_NAME), 'utf8');
  }

  /**
   * Salva os dados do aplicativo processado nos arquivos de relatório JSON.
   * 
   * @param {string} processedAppsComPackage - A sequência JSON de aplicativos com pacotes Winget.
   * @param {string} processedAppsPrejudicados - A sequência JSON de aplicativos sem pacotes Winget ou com problemas.
   */
  static gravarRelatoriosJson(processedAppsComPackage, processedAppsPrejudicados) {
    fs.writeFileSync(this.#criaOutputPathJson(TipoProcessamento.COM_PACKAGE), processedAppsComPackage);
    fs.writeFileSync(this.#criaOutputPathJson(TipoProcessamento.PREJUDICADO), processedAppsPrejudicados);
  }

  static #criaOutputPathJson(tipoProcessamento) {
    return Constants.FOLDER_RESULT_PATH + Constants.BARRA + tipoProcessamento + FormatoDeArquivo.JSON;
  }
}

module.exports = FileUtils;
