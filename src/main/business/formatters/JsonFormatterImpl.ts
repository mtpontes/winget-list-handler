import IFormatter from "./IFormatter.js";
import type { AppsComPackageType } from "../../infra/types/AppsComPackageType.js";

export default class JsonFormatterImpl implements IFormatter {
  /**
   * Converte a lista de aplicativos com pacotes completos para um array de objetos formatados.
   *
   * @param {Array<Array<string>>} comPacote - Lista de aplicativos, onde cada item contém nome, ID e, opcionalmente, a versão.
   * @returns {Array<AppsComPackageType>} Lista de objetos representando os aplicativos com pacotes completos.
   *
   * @example
   * const apps = [
   *   ["App1", "12345", "1.0.0"],
   *   ["App2", "67890"]
   * ];
   * formatarAppsComPacote(apps);
   * // Retorna:
   * // [
   * //   { "nome": "App1", "id": "12345", "version": "1.0.0" },
   * //   { "nome": "App2", "id": "67890", "version": null }
   * // ]
   */
  public formatarAppsComPacote(comPacote: Array<Array<string>>): Array<AppsComPackageType> {
    return comPacote.map(([nome, id, version = null]) => ({ nome, id, version })).filter(({ nome }) => nome?.trim());
  }

  /**
   * Converte a lista de aplicativos prejudicados para um array de strings formatado.
   *
   * @param {Array<Array<string>>} prejudicados - Lista de aplicativos prejudicados contendo apenas o nome de cada aplicativo.
   * @returns {Array<string>} Lista de nomes dos aplicativos prejudicados.
   *
   * @example
   * const apps = [
   *   ["App1"],
   *   ["App2"],
   *   [""]  // Nome vazio será ignorado
   * ];
   * formatarAppsPrejudicados(apps);
   * // Retorna:
   * // [
   * //   "App1",
   * //   "App2"
   * // ]
   */
  public formatAppsSemPacote(prejudicados: Array<Array<string>>): Array<string> {
    return prejudicados.map(([nome]) => nome).filter((linha) => linha.trim());
  }
}
