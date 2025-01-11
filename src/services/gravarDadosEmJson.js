const fs = require('fs');
const { ProcessadorJson } = require('../processors/processadores');
const { Constants, TipoProcessamento, FormatoDeArquivo } = require('../constants/constants');

/**
 * Escreve os dados processados em arquivos no formato especificado.
 * 
 * Esta função processa e grava dois conjuntos de dados:
 * - Aplicativos com pacotes disponíveis.
 * - Aplicativos com pacotes prejudicados ou ausentes.
 * 
 * Os arquivos gerados terão nomes baseados no tipo de processamento (`COM_PACKAGE` e `PREJUDICADO`)
 * e serão salvos no formato especificado.
 * 
 * @param {Array<Array<string>>} appsComPackage - Os dados dos aplicativos com pacotes disponíveis.
 * @param {Array<Array<string>>} appsPrejudicados - Os dados dos aplicativos com pacotes prejudicados ou ausentes.
 * @param {FormatoDeArquivo} formatoDeArquivo - O formato do arquivo de saída (e.g., `.json`).
 * 
 * @throws {Error} Caso ocorra algum problema na escrita de qualquer arquivo.
 */
function escreverDadosEmArquivo(appsComPackage, appsPrejudicados, formatoDeArquivo) {
  let outpupath_comPackage =
    Constants.FOLDER_RESULT_PATH + '/' + TipoProcessamento.COM_PACKAGE + formatoDeArquivo;
  let outpupath_prejudicados =
    Constants.FOLDER_RESULT_PATH + '/' + TipoProcessamento.PREJUDICADO + formatoDeArquivo;

  const { processedAppsComPackage, processedAppsPrejudicados } = new ProcessadorJson().processar({
    appsComPackage,
    appsPrejudicados,
  });

  fs.writeFileSync(outpupath_comPackage, processedAppsComPackage);
  fs.writeFileSync(outpupath_prejudicados, processedAppsPrejudicados);
}

/**
 * Grava os dados processados para diferentes tipos de processamento em arquivos separados.
 * 
 * Esta função delega a lógica de gravação para `escreverDadosEmArquivo`, salvando os dados de aplicativos
 * classificados como com pacotes disponíveis e com pacotes prejudicados ou ausentes no formato JSON.
 * 
 * @param {Array<Array<string>>} comPackage - Os dados dos aplicativos com pacotes disponíveis.
 * @param {Array<Array<string>>} prejudicado - Os dados dos aplicativos com pacotes prejudicados ou ausentes.
 * 
 * @throws {Error} Caso ocorra algum problema na escrita de qualquer arquivo.
 */
function gravarDados(comPackage, prejudicado) {
  escreverDadosEmArquivo(comPackage, prejudicado, FormatoDeArquivo.JSON);
}

module.exports = gravarDados;
