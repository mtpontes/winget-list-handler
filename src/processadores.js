const { TipoProcessamento } = require('./constants');


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
 * a lógica para processar dados com base em um tipo específico de processamento.
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
   * Processa os dados fornecidos e os retorna como uma string JSON formatada.
   * 
   * @param {Array<Array<string>>} data - Os dados a serem processados. 
   * Cada linha é representada como um array de strings.
   * 
   * @returns {string} Os dados processados como uma string JSON formatada.
   */
  processar(data) {
    data = this.executarProcessamentoPorTipo(data);
    return JSON.stringify(data, null, 2);
  }

  /**
   * Executa o processamento dos dados com base no tipo de processamento especificado.
   * 
   * @param {Array<Array<string>>} data - Os dados a serem processados.
   * 
   * @returns {Array<Object>|Array<string>} Os dados processados:
   * - Para `TipoProcessamento.COM_PACKAGE`, retorna um array de objetos com chave e valor.
   * - Para `TipoProcessamento.PREJUDICADO`, retorna um array de strings.
   */
  executarProcessamentoPorTipo(data) {
    switch (this.tipoProcessamento) {
      case TipoProcessamento.COM_PACKAGE:
        return data.map(linha => {
          const chave = linha[0];
          const valor = linha[1];
          return { nome: valor, id: chave };
        }).filter(linha => {
          const chave = Object.keys(linha)[0];
          return chave !== '' && chave !== null && chave !== undefined; // Filtra valores inválidos
        });

      case TipoProcessamento.PREJUDICADO:
        return data.map(linha => linha[0])
          .filter(linha => linha && linha.trim() !== '');

      default:
        throw new Error("Tipo de processamento inválido");
    }
  }
}

module.exports = {
  Processador,
  ProcessadorJson
};