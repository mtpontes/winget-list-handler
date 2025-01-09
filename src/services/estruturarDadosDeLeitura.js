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
function estruturarDadosDeLeitura(data) {
  data = data.split('\n')
  const indiceDeComecoDosDadosUteis = data.findIndex(linha => linha.includes('ID'))
  data = data.slice(indiceDeComecoDosDadosUteis + 2) // Pula a linha das colunas e pula a linha que separa as colunas das linhas
  return data.map(linha => linha.split(/\s{2,}/)); // Quebra cada texto com mais de dois espaços em uma lista de Strings
}

module.exports = estruturarDadosDeLeitura