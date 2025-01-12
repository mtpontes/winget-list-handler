const fs = require('fs');
const shelljs = require('shelljs');
const { Constants, TipoProcessamento } = require('../constants/constants');

class FileUtils {

  /**
   * Cria o diretório se não existir
   */
  static criarPastaDeDespejo() {
    const path = Constants.FOLDER_RESULT_PATH
    if (!fs.existsSync(path))
      fs.mkdirSync(path, { recursive: true })
  }

  static geraArquivoDoWinget() {
    shelljs.exec(`winget list > ${Constants.BASE_FILE_PATH.slice(2)}`);
  }

  static readFile() {
    return fs.readFileSync(Constants.BASE_FILE_PATH, 'utf8')
  }

  static gravarRelatoriosJson(processedAppsComPackage, processedAppsPrejudicados, formatoDeArquivo) {
    let outpupath_comPackage =
      Constants.FOLDER_RESULT_PATH + '/' + TipoProcessamento.COM_PACKAGE + formatoDeArquivo;
    let outpupath_prejudicados =
      Constants.FOLDER_RESULT_PATH + '/' + TipoProcessamento.PREJUDICADO + formatoDeArquivo;

    fs.writeFileSync(outpupath_comPackage, processedAppsComPackage);
    fs.writeFileSync(outpupath_prejudicados, processedAppsPrejudicados);
  }
}

module.exports = FileUtils