const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { Queue } = require('async-await-queue');
const { Constants } = require('../constants/constants');
const { FileNotReadableError, InvalidJsonFormat } = require('../error/errors')

/**
 * Lê e retorna a lista de pacotes a partir de um arquivo JSON.
 * @returns {Array} Lista de pacotes.
 * @throws {FileNotReadableError} Se o arquivo não puder ser lido.
 * @throws {InvalidJsonFormat} Se o conteúdo do arquivo não for um JSON válido ou não for um array.
 */
function getPackages() {
  let filePath = null;
  try {
    filePath = path.resolve(Constants.CAMINHO_DO_ARQUIVO_DE_APPS_COM_PACOTES_GERADO);
    const packagesString = fs.readFileSync(filePath, { encoding: Constants.UTF_8 });
    const packages = JSON.parse(packagesString);
    console.log('==== VALOR DE PACKAGES === : ', packages)
    console.log('==== VALOR DE PACKAGES === : ', !Array.isArray(packages))

    if (!Array.isArray(packages)) {
      console.log('=========== LANÇOU InvalidJsonFormat =============')
      throw new InvalidJsonFormat();
    }
    console.log('======================= NÃO TEVE O LOG =====================')
    return packages;

  } catch (error) {
    console.log(error)
    if (error instanceof InvalidJsonFormat) {
      console.log('=========== RELANÇOU InvalidJsonFormat =============')
      throw error
    };
    throw new FileNotReadableError(filePath);
  }
}

/**
 * Instala os pacotes de forma síncrona, um por vez.
 * @param {Array} packages - Lista de pacotes a serem instalados.
 */
function instalacaoSync(packages) {
  for (const pkg of packages) {
    const command = `${Constants.ARQUIVO_BAT} ${pkg.id}`;
    console.log(command);

    shell.exec(command, { silent: false });
    console.log('\n');
  }
}

/**
 * Instala os pacotes de forma assíncrona, com controle de concorrência.
 * @param {Array} packages - Lista de pacotes a serem instalados.
 * @param {number} concurrency - Número máximo de instalações simultâneas.
 * @returns {Promise} Uma Promise que resolve quando todos os pacotes forem instalados.
 */
async function instalacaoAsync(packages, concurrency) {
  const queue = new Queue(concurrency);

  const tasks = packages.map(pkg => queue.run(() => {
    const command = `${Constants.ARQUIVO_BAT} ${pkg.id}`;
    console.log(command);
    return new Promise((resolve) => {
      shell.exec(command, { silent: false, async: true }, resolve);
    });
  }));

  await Promise.all(tasks);
  console.log(' === Todos os pacotes foram instalados === ');
}

/**
 * Instala os pacotes de acordo com a opção de execução (síncrona ou assíncrona).
 * @param {Object} options - Opções de instalação.
 * @param {boolean} options.isAsync - Se true, a instalação será assíncrona.
 * @param {number} options.concurrency - Número máximo de instalações simultâneas (apenas para instalação assíncrona).
 * @returns {Promise} Uma Promise que resolve quando a instalação for concluída.
 */
async function instalarPacotes({ isAsync, concurrency }) {
  const packages = getPackages();

  if (!isAsync) {
    instalacaoSync(packages)
  } else {
    instalacaoAsync(packages, concurrency)
  }
}

module.exports = instalarPacotes;
