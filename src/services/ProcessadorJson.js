const { IdentificadorPadraoTextual } = require('../constants/constants');

class ProcessadorJson {
  constructor() { }

  /**
   * Filtra e estrutura dados formatados em linhas para um array de arrays de strings.
   *
   * A função identifica onde os dados úteis começam, ignorando cabeçalhos e separadores,
   * e processa cada linha relevante dividindo os textos com base em dois ou mais espaços consecutivos.
   *
   * @param {string} data - A string de entrada contendo os dados formatados em linhas.
   *
   * @returns {Array<Array<string>>} Um array de arrays de strings, onde cada subarray
   * representa uma linha útil da entrada, com os textos divididos em colunas.
   *
   * @example
   * // Exemplo de entrada:
   * const data = `
   * Nome                  ID                       Versão      Origem
   * --------------------------------------------------------------
   * GIMP 2.10.38          XPDM27W10192Q0          2.10.38      msstore
   * `;
   *
   * const result = estruturarDadosDeLeitura(data);
   * console.log(result);
   * // Saída:
   * [
   *   ["GIMP 2.10.38", "XPDM27W10192Q0", "2.10.38", "msstore"]
   * ]
   */
  #estruturarDadosDeLeitura(data) {
    data = data.split("\n");
    const indiceDeComecoDosDadosUteis = data.findIndex((linha) =>
      linha.includes("ID")
    );
    data = data.slice(indiceDeComecoDosDadosUteis + 2); // Pula a linha das colunas e pula a linha que separa as colunas das linhas
    return data.map((linha) => linha.split(/\s{2,}/)); // Quebra cada texto com mais de dois espaços em uma lista de Strings
  }

  /**
   * Segrega os aplicativos em dois grupos: com pacotes completos e com pacotes ausentes ou prejudicados.
   *
   * A função processa os dados de entrada, separando linhas que representam aplicativos com pacotes completos
   * das linhas que indicam aplicativos com ausência ou prejuízo de pacotes, com base em identificadores predefinidos.
   *
   * @param {Array<Array<string>>} data - Um array de arrays de strings, onde cada subarray representa uma linha de dados.
   *                                      Cada linha contém informações sobre aplicativos e seus pacotes.
   *
   * @returns {Object} Um objeto contendo dois grupos de aplicativos:
   * - `comPackage`: Um array contendo as linhas que representam aplicativos com pacotes completos (sem os identificadores de ausência ou prejuízo de pacotes).
   * - `appsPrejudicados`: Um array contendo as linhas que representam aplicativos com ausência ou prejuízo de pacotes.
   *
   * @example
   * // Exemplo de entrada:
   * const data = [
   *   ["App1", "1.0.0", "winget"],
   *   ["App2", "2.0.0", "ARP"],
   *   ["App3", "3.0.0", "winget", "PREJUIZO"]
   * ];
   *
   * const result = segregarTiposDeApps(data);
   * console.log(result);
   * // Saída:
   * // {
   * //   comPackage: [["App1", "1.0.0", "winget"]],
   * //   appsPrejudicados: [
   * //     ["App2", "2.0.0", "ARP"],
   * //     ["App3", "3.0.0", "winget", "PREJUIZO"]
   * //   ]
   * // }
   */
  #segregarTiposDeApps(data) {
    const appsComPackage = data.filter(linha => linha.every(coluna =>
      !coluna.trim().includes(IdentificadorPadraoTextual.AUSENCIA_DE_PACOTE) &&
      !coluna.trim().includes(IdentificadorPadraoTextual.PREJUIZO_DE_PACOTE))
    )

    const appsPrejudicados = data.filter(linha => linha.some(texto =>
      texto.includes(IdentificadorPadraoTextual.PREJUIZO_DE_PACOTE) ||
      texto.includes(IdentificadorPadraoTextual.AUSENCIA_DE_PACOTE))
    )

    data = null
    return { appsComPackage, appsPrejudicados }
  }

  processarParaJson(data) {
    let structuredData = this.#estruturarDadosDeLeitura(data)
    let { appsComPackage, appsPrejudicados } = this.#segregarTiposDeApps(structuredData)

    // Processamento de aplicativos com pacotes disponíveis
    appsComPackage = appsComPackage
      .map((linha) => {
        const nome = linha[0];
        const id = linha[1];
        const version = linha[2] ? linha[2] : null;
        return { nome: nome, id: id, version: version };
      })
      .filter((linha) => linha.nome && linha.nome.trim() !== "");

    // Processamento de aplicativos prejudicados
    appsPrejudicados = appsPrejudicados
      .map((linha) => linha[0])
      .filter((linha) => linha && linha.trim() !== "");

    const processedAppsComPackage = JSON.stringify(appsComPackage, null, 2);
    const processedAppsPrejudicados = JSON.stringify(appsPrejudicados, null, 2);
    appsComPackage = null
    appsPrejudicados = null

    return { processedAppsComPackage, processedAppsPrejudicados };
  }
}

module.exports = ProcessadorJson
