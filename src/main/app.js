const instalarPacotes = require('./services/instalarPacotes');
const FileUtils = require('./utils/FileUtils')
const FormatadorJson = require('./services/FormatadorJson');
const ProcessadorDeDados = require('./services/ProcessadorDeDados');

const processador = new ProcessadorDeDados();
const formatadorJson = new FormatadorJson();

function runGerarSomenteArquivos() {
  FileUtils.geraArquivoDoWinget()
  FileUtils.criarPastaDeDespejo()
  const wingetListFileData = FileUtils.readWingetListFile()

  let { appsComPackage, appsPrejudicados } = processador.processar(wingetListFileData)
  let formatedAppsComPackage = formatadorJson.formatarAppsComPackage(appsComPackage)
  let formatedAppsPrejudicados = formatadorJson.formatarAppsPrejudicados(appsPrejudicados)

  FileUtils.gravarRelatoriosJson(formatedAppsComPackage, formatedAppsPrejudicados)
}

async function runConsumirArquivo({ isAsync = false, concurrency = 5 }) {
  await instalarPacotes({ isAsync: isAsync, concurrency: concurrency });
}

module.exports = { runGerarSomenteArquivos, runConsumirArquivo };
