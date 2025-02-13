const instalarPacotes = require('./services/instalarPacotes');
const FileUtils = require('./utils/FileUtils')
const FormatadorJson = require('./services/ProcessadorJson');
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

async function runConsumirArquivo({ isAsync = false }) {
  await instalarPacotes({ isAsync: isAsync });
}

module.exports = { runGerarSomenteArquivos, runConsumirArquivo };
