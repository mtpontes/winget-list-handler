const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { Constants } = require('../constants/constants');
const { FileNotReadableError } = require('../error/errors');

/**
 * Recupera os pacotes instalados do aplicativo.
 * 
 * @summary Recupera a lista de pacotes que foram gerados para o aplicativo.
 * 
 * @description Este método lê o arquivo `apps-com-pacotes.json` e retorna essas informações como uma objeto JSON.
 * 
 * @returns {Object} Um objeto contendo as especificações dos pacotes.
 * 
 * @throws {Error} Se o arquivo não pode ser lido, um erro FileNotReadableError será lançado.
 */
function getPackages() {
  let filePath = null;
  try {
    filePath = path.resolve(Constants.CAMINHO_DO_ARQUIVO_DE_APPS_COM_PACOTES_GERADO);
    packagesString = fs.readFileSync(filePath, Constants.UTF_8);
    return JSON.parse(packagesString); // Converte o JSON string para objeto

  } catch (error) {
    throw new FileNotReadableError(filePath);
  }
}

/**
 * Instala os pacotes listados em um arquivo JSON executando comandos de arquivo Batch para cada pacote.
 *
 * @param {Object} options - Opções para a instalação dos pacotes.
 * @param {boolean} [options.isAsync=false] - Booleano indicando se os comandos de instalação devem ser executados assim que possível.
 *
 * @returns {void} - Realiza o processo de instalação dos pacotes.
 * @throws {FileNotReadableError} Se o arquivo JSON não pode ser lido.
 * @asynchronous
 */
async function instalarPacotes({ isAsync = false }) {
  const packages = getPackages();

  for (const pkg of packages) {
    const command = `${Constants.CAMINHO_ARQUIVO_BAT} ${pkg.id}`;
    console.log(command);
    shell.exec(command.slice(3), { silent: false, async: isAsync });
    console.log('\n');
  }
}

module.exports = instalarPacotes;
