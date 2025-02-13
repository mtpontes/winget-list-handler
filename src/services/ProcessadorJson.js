const { IdentificadorPadraoTextual } = require('../constants/constants');

class FormatadorJson {
  constructor() { }

  /**
   * Converte a lista de aplicativos com pacotes completos para um JSON formatado.
   *
   * @param {Array<Array<string>>} appsComPackage - Lista de aplicativos contendo nome, ID e versão.
   * @returns {string} JSON formatado representando os aplicativos com pacotes completos.
   *
   * @example
   * const apps = [
   *   ["App1", "12345", "1.0.0"],
   *   ["App2", "67890"]
   * ];
   * formatarAppsComPackage(apps);
   * // Retorna:
   * // [
   * //   { "nome": "App1", "id": "12345", "version": "1.0.0" },
   * //   { "nome": "App2", "id": "67890", "version": null }
   * // ]
   */
  formatarAppsComPackage(appsComPackage) {
    const formatted = appsComPackage
      .map(([nome, id, version = null]) => ({ nome, id, version }))
      .filter(({ nome }) => nome?.trim());

    return JSON.stringify(formatted, null, 2);
  }

  /**
   * Converte a lista de aplicativos prejudicados para um JSON formatado.
   *
   * @param {Array<Array<string>>} appsPrejudicados - Lista de aplicativos prejudicados contendo apenas o nome.
   * @returns {string} JSON formatado representando os aplicativos prejudicados.
   *
   * @example
   * const apps = [
   *   ["App1"],
   *   ["App2"],
   *   [""]
   * ];
   * formatarAppsPrejudicados(apps);
   * // Retorna:
   * // [
   * //   "App1",
   * //   "App2"
   * // ]
   */
  formatarAppsPrejudicados(appsPrejudicados) {
    const formatted = appsPrejudicados
      .map(([nome]) => nome)
      .filter((nome) => nome?.trim());

    return JSON.stringify(formatted, null, 2);
  }
}

module.exports = FormatadorJson;
