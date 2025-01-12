const fs = require('fs');
const shelljs = require('shelljs');
const { Constants, TipoProcessamento } = require('../constants/constants');

/**
 * Utility class for handling file operations related to the Winget list handler.
 */
class FileUtils {

  /**
   * Creates the directory for dumping output files if it doesn't already exist.
   */
  static criarPastaDeDespejo() {
    const path = Constants.FOLDER_RESULT_PATH;
    if (!fs.existsSync(path))
      fs.mkdirSync(path, { recursive: true });
  }

  /**
   * Generates a file containing the list of installed apps using Winget.
   * The output is saved to the base file path defined in the constants.
   */
  static geraArquivoDoWinget() {
    shelljs.exec(`winget list > ${Constants.BASE_FILE_PATH.slice(2)}`);
  }

  /**
   * Reads the Winget output file and returns its content as a string.
   * 
   * @returns {string} The content of the Winget output file.
   */
  static readFile() {
    return fs.readFileSync(Constants.BASE_FILE_PATH, 'utf8');
  }

  /**
   * Saves the processed app data into JSON report files.
   * 
   * @param {string} processedAppsComPackage - The JSON string of apps with Winget packages.
   * @param {string} processedAppsPrejudicados - The JSON string of apps without Winget packages or with issues.
   * @param {string} formatoDeArquivo - The file format extension (e.g., `.json`).
   */
  static gravarRelatoriosJson(processedAppsComPackage, processedAppsPrejudicados, formatoDeArquivo) {
    let outpupath_comPackage =
      Constants.FOLDER_RESULT_PATH + '/' + TipoProcessamento.COM_PACKAGE + formatoDeArquivo;
    let outpupath_prejudicados =
      Constants.FOLDER_RESULT_PATH + '/' + TipoProcessamento.PREJUDICADO + formatoDeArquivo;

    fs.writeFileSync(outpupath_comPackage, processedAppsComPackage);
    fs.writeFileSync(outpupath_prejudicados, processedAppsPrejudicados);
  }
}

module.exports = FileUtils;
