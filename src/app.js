const fs = require('fs');
const shelljs = require('shelljs');
const estruturarDadosDeLeitura = require('./estruturarDadosDeLeitura')
const segregarTiposDeApps = require('./segregarTiposDeApps')
const criarPastaDeDespejo = require('./criarPastaDeDespejo')
const gravarDados = require('./gravarDados');
const { Constants } = require('./constants')

async function geraArquivoDoWinget() {
  await shelljs.exec(`winget list > ${Constants.BASE_FILE_PATH.slice(2)}`)
}

function iniciarFluxoDeTratamentoDeDados() {
  // Lê o arquivo de pacotes do winget
  fs.readFile(Constants.BASE_FILE_PATH, 'utf8', (error, data) => {
    if (error) return console.error({ error: 'Erro ao ler o arquivo', catch: `${error}` }); // Captura e loga erro
    criarPastaDeDespejo(Constants.FOLDER_RESULT_PATH)

    const lines = estruturarDadosDeLeitura(data)
    let { comPackage, appsPrejudicados } = segregarTiposDeApps(lines)
    gravarDados( comPackage, appsPrejudicados)
  });
}

async function run() {
  await geraArquivoDoWinget()
  iniciarFluxoDeTratamentoDeDados()
}

module.exports = { run: run }