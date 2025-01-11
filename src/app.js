const fs = require('fs');
const shelljs = require('shelljs');
const estruturarDadosDeLeitura = require('./services/estruturarDadosDeLeitura');
const segregarTiposDeApps = require('./services/segregarTiposDeApps');
const criarPastaDeDespejo = require('./services/criarPastaDeDespejo');
const gravarDados = require('./services/gravarDadosEmJson');
const instalarPacotes = require('./services/instalarPacotes');
const { Constants } = require('./constants/constants');

/**
 * Gera um arquivo de pacotes a partir do comando `winget list` e grava no caminho especificado.
 * 
 * Este método executa o comando `winget list` utilizando `shelljs` e escreve a saída no arquivo definido em `Constants.BASE_FILE_PATH`.
 * 
 * @async
 * @throws {Error} Se houver erro na execução do comando ou no processo de escrita.
 */
async function geraArquivoDoWinget() {
  await shelljs.exec(`winget list > ${Constants.BASE_FILE_PATH.slice(2)}`);
}

/**
 * Inicia o fluxo de tratamento de dados após a leitura do arquivo de pacotes.
 * 
 * Este método lê o arquivo de pacotes listado pelo `winget`, processa os dados para estruturar
 * as informações, segrega os aplicativos com pacotes válidos e os prejudicados, e grava os resultados
 * em um formato JSON.
 * 
 * @async
 * @throws {Error} Se ocorrer um erro ao ler o arquivo de pacotes.
 */
async function iniciarFluxoDeTratamentoDeDados() {
  // Lê o arquivo de pacotes do winget
  await fs.readFile(Constants.BASE_FILE_PATH, 'utf8', (error, data) => {
    if (error) return console.error({ error: 'Erro ao ler o arquivo', catch: `${error}` });
    criarPastaDeDespejo(Constants.FOLDER_RESULT_PATH);

    const lines = estruturarDadosDeLeitura(data);
    let { comPackage, appsPrejudicados } = segregarTiposDeApps(lines);
    gravarDados(comPackage, appsPrejudicados);
  });
}

/**
 * Executa o fluxo completo de geração de arquivos e tratamento de dados.
 * 
 * Este método chama a função `geraArquivoDoWinget` para gerar o arquivo de pacotes e, em seguida,
 * chama `iniciarFluxoDeTratamentoDeDados` para processar e gravar os dados.
 * 
 * @async
 * @throws {Error} Se ocorrer um erro em qualquer uma das etapas de execução.
 */
async function runGerarSomenteArquivos() {
  await geraArquivoDoWinget();
  await iniciarFluxoDeTratamentoDeDados();
}

/**
 * Executa o fluxo de consumo do arquivo de pacotes para instalar os pacotes listados.
 * 
 * Este método chama a função `instalarPacotes`, que realiza a instalação dos pacotes
 * definidos no arquivo de pacotes do `winget`.
 * 
 * @async
 * @throws {Error} Se ocorrer um erro ao tentar instalar os pacotes.
 */
async function runConsumirArquivo() {
  await instalarPacotes();
}

module.exports = { runGerarSomenteArquivos, runConsumirArquivo };
