const fs = require('fs');
const { Processador, ProcessadorJson } = require('../processors/processadores');
const { Constants, TipoProcessamento } = require('../constants/constants');

/**
 * Escreve os dados processados em um arquivo no formato especificado.
 * 
 * @param {Array<Array<string>>} data - Os dados a serem escritos no arquivo, organizados como um array de arrays de strings.
 * @param {TipoProcessamento} tipoProcessamento - O tipo de processamento aplicado aos dados, usado para definir o nome do arquivo.
 * @param {string} formatoDeArquivo - O formato do arquivo de saída (e.g., `.json`, `.txt`).
 * @param {Processador} processador - Uma instância de um processador responsável por transformar os dados antes da gravação.
 * 
 * @throws {Error} Caso ocorra algum problema na escrita do arquivo.
 */
function escreverDadosEmArquivo(data, tipoProcessamento, formatoDeArquivo, processador) {
  let outpupath = Constants.FOLDER_RESULT_PATH + '/' + tipoProcessamento + formatoDeArquivo

  let lines = processador.processar(data)
  fs.writeFileSync(outpupath, lines);
}

/**
 * Grava os dados processados para diferentes tipos de processamento em arquivos separados.
 * 
 * Esta função utiliza `escreverDadosEmArquivo` para salvar dados classificados em dois tipos:
 * - Aplicativos com pacotes disponíveis (`comPackage`).
 * - Aplicativos com pacotes prejudicados ou ausentes (`prejudicado`).
 * 
 * Os arquivos gerados têm o formato JSON.
 * 
 * @param {Array<Array<string>>} comPackage - Os dados dos aplicativos com pacotes disponíveis.
 * @param {Array<Array<string>>} prejudicado - Os dados dos aplicativos com pacotes prejudicados ou ausentes.
 * 
 * @throws {Error} Caso ocorra algum problema na escrita de qualquer arquivo.
 */
function gravarDados(comPackage, prejudicado) {
  escreverDadosEmArquivo(
    comPackage,
    TipoProcessamento.COM_PACKAGE,
    Constants.FORMATOS_DE_ARQUIVO.json,
    new ProcessadorJson(TipoProcessamento.COM_PACKAGE)
  )

  escreverDadosEmArquivo(
    prejudicado,
    TipoProcessamento.PREJUDICADO,
    Constants.FORMATOS_DE_ARQUIVO.json,
    new ProcessadorJson(TipoProcessamento.PREJUDICADO)
  )
}

module.exports = gravarDados