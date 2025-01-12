const instalarPacotes = require('./services/instalarPacotes');
const { FormatoDeArquivo } = require('./constants/constants');
const FileUtils = require('./utils/FileUtils')
const ProcessadorJson = require('./services/ProcessadorJson')

function runGerarSomenteArquivos() {
  FileUtils.geraArquivoDoWinget()
  FileUtils.criarPastaDeDespejo()
  let {
    processedAppsComPackage,
    processedAppsPrejudicados
  } = new ProcessadorJson().processarParaJson(FileUtils.readFile())

  FileUtils.gravarRelatoriosJson(
    processedAppsComPackage,
    processedAppsPrejudicados,
    FormatoDeArquivo.JSON
  )
}

async function runConsumirArquivo() {
  await instalarPacotes();
}

module.exports = { runGerarSomenteArquivos, runConsumirArquivo };
