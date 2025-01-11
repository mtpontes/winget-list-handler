const { TipoProcessamento } = require('../constants/constants');

/**
 * Classe base abstrata para processadores de dados.
 * 
 * Esta classe define o contrato de um processador e impede que seja instanciada diretamente.
 */
class Processador {
  /**
   * Processa os dados fornecidos.
   * 
   * @abstract
   * @param {any} data - Os dados a serem processados.
   * @throws {TypeError} Se tentar instanciar ou chamar diretamente esta classe.
   */
  processar(data) {
    if (new.target === Processador) {
      throw new TypeError("Não é possível criar uma instância de Processador diretamente");
    }
  }
}

/**
 * Processador especializado para manipulação e formatação de dados como JSON.
 * 
 * Esta classe estende a funcionalidade da classe base `Processador` e implementa 
 * a lógica para processar os dados relacionados a aplicativos com pacotes disponíveis e prejudicados.
 */
class ProcessadorJson extends Processador {
  /**
   * Cria uma instância de `ProcessadorJson`.
   * 
   * @param {TipoProcessamento} tipoProcessamento - O tipo de processamento a ser aplicado aos dados.
   */
  constructor(tipoProcessamento) {
    super();
    this.tipoProcessamento = tipoProcessamento;
  }

  /**
   * Processa os dados fornecidos e os retorna como strings JSON formatadas.
   * 
   * O processamento inclui:
   * - Para os aplicativos com pacotes disponíveis, cria um array de objetos com `nome`, `id`, e `version`.
   * - Para os aplicativos prejudicados, cria um array de strings com os nomes dos aplicativos.
   * 
   * @param {Object} data - Os dados a serem processados.
   * @param {Array<Array<string>>} data.appsComPackage - Os dados dos aplicativos com pacotes disponíveis.
   * @param {Array<Array<string>>} data.appsPrejudicados - Os dados dos aplicativos com pacotes prejudicados ou ausentes.
   * 
   * @returns {Object} Um objeto com duas propriedades:
   *   - `processedAppsComPackage`: A lista de aplicativos com pacotes disponíveis em formato JSON.
   *   - `processedAppsPrejudicados`: A lista de aplicativos prejudicados em formato JSON.
   */
  processar(data) {
    let { appsComPackage, appsPrejudicados } = data;

    // Processamento de aplicativos com pacotes disponíveis
    appsComPackage = appsComPackage.map(linha => {
      const nome = linha[0];
      const id = linha[1];
      const version = linha[2] ? linha[2] : null;
      return { 'nome': nome, 'id': id, version: version };
    }).filter(linha => (linha.nome && linha.nome.trim() !== ''));

    // Processamento de aplicativos prejudicados
    appsPrejudicados = appsPrejudicados.map(linha => linha[0])
      .filter(linha => linha && linha.trim() !== '');

    const processedAppsComPackage = JSON.stringify(appsComPackage, null, 2);
    const processedAppsPrejudicados = JSON.stringify(appsPrejudicados, null, 2);

    return { processedAppsComPackage, processedAppsPrejudicados };
  }
}

module.exports = {
  Processador,
  ProcessadorJson
};
