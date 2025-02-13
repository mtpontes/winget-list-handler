const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { Constants } = require('../constants/constants');
const { FileNotReadableError, FileNotFoundError } = require('../error/errors');

/**
 * Installs the packages listed in the JSON file by executing a batch file command for each package.
 * 
 * @param {Object} options - Options for the package installation.
 * @param {boolean} [options.isAsync=false] - Whether to execute the installation commands asynchronously.
 * 
 * @throws {FileNotFoundError} If the file containing the list of packages is not found.
 * @throws {FileNotReadableError} If the file containing the list of packages cannot be read.
 */
async function instalarPacotes({ isAsync = false }) {
  try {
    const filePath = path.resolve(__dirname, Constants.CAMINHO_DO_ARQUIVO_DE_APPS_COM_PACOTES_GERADO);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const packages = JSON.parse(content); // Converte o JSON string para objeto

      for (const pkg of packages) {
        const command = `${Constants.CAMINHO_ARQUIVO_BAT} ${pkg.id}`;
        console.log(command);

        shell.exec(command.slice(3), { silent: false, async: isAsync });
        console.log('\n');
      }
    } catch (error) {
      throw new FileNotReadableError();
    }
  } catch (error) {
    if (error instanceof FileNotReadableError) throw error;
    throw new FileNotFoundError();
  }
}

module.exports = instalarPacotes;
