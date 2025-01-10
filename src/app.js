const fs = require('fs');
const shelljs = require('shelljs');
const estruturarDadosDeLeitura = require('./services/estruturarDadosDeLeitura')
const segregarTiposDeApps = require('./services/segregarTiposDeApps')
const criarPastaDeDespejo = require('./services/criarPastaDeDespejo')
const gravarDados = require('./services/gravarDadosEmJson');
const instalarPacotes = require('./services/instalarPacotes');
const { Constants } = require('./constants/constants')

async function geraArquivoDoWinget() {
  await shelljs.exec(`winget list > ${Constants.BASE_FILE_PATH.slice(2)}`)
}

async function iniciarFluxoDeTratamentoDeDados() {
  // Lê o arquivo de pacotes do winget
  await fs.readFile(Constants.BASE_FILE_PATH, 'utf8', (error, data) => {
    if (error) return console.error({ error: 'Erro ao ler o arquivo', catch: `${error}` });
    criarPastaDeDespejo(Constants.FOLDER_RESULT_PATH)

    const lines = estruturarDadosDeLeitura(data)
    let { comPackage, appsPrejudicados } = segregarTiposDeApps(lines)
    gravarDados(comPackage, appsPrejudicados)
  });
}

async function runGerarSomenteArquivos() {
  await geraArquivoDoWinget()
  await iniciarFluxoDeTratamentoDeDados()
}

async function runConsumirArquivo() {
  await instalarPacotes()
}

module.exports = { runGerarSomenteArquivos, runConsumirArquivo }