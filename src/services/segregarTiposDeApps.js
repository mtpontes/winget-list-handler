const { Constants, IdentificadorPadraoTextual } = require('../constants/constants')

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
function segregarTiposDeApps(data) {
  const comPackage = data
    .filter(linha => linha.every(coluna =>
      !coluna.trim().includes(IdentificadorPadraoTextual.AUSENCIA_DE_PACOTE) &&
      !coluna.trim().includes(IdentificadorPadraoTextual.PREJUIZO_DE_PACOTE))
    );

  const appsPrejudicados = data
    .filter(linha => linha.some(texto =>
      texto.includes(IdentificadorPadraoTextual.PREJUIZO_DE_PACOTE) ||
      texto.includes(IdentificadorPadraoTextual.AUSENCIA_DE_PACOTE)))

  return { comPackage, appsPrejudicados }
}

module.exports = segregarTiposDeApps