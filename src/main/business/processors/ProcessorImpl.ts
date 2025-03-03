import IProcessor from "./IProcessor";
import Constants from "../../domain/constants/Constants";
import BadPackagesConst from "../../domain/constants/BadPackagesConst";
import { PacotesProcessadosType } from "../../infra/types/PacotesProcessados";

/**
 * Classe responsável por processar dados formatados em texto, extraindo informações úteis
 * e segregando os aplicativos com pacotes completos e os que possuem pacotes ausentes ou prejudicados.
 */
export default class ProcessorImpl implements IProcessor {
  /**
   * Filtra e estrutura dados formatados em linhas para um array de arrays de strings.
   *
   * A função identifica onde os dados úteis começam, ignorando cabeçalhos e separadores,
   * e processa cada linha relevante dividindo os textos com base em dois ou mais espaços consecutivos.
   *
   * @private
   * @param {string} data - A string de entrada contendo os dados formatados em linhas.
   *
   * @returns {Array<Array<string>>} Um array de arrays de strings, onde cada subarray
   * representa uma linha útil da entrada, com os textos divididos em colunas.
   */
  private estruturarDadosDeLeitura(data: string): Array<Array<string>> {
    let linhas: Array<string> = data.split("\n");
    const indiceDeComecoDosDadosUteis = linhas.findIndex((linha) => linha.includes(Constants.ID));
    linhas = linhas.slice(indiceDeComecoDosDadosUteis + 2);
    return linhas.map((linha) => linha.split(/\s{2,}/));
  }

  /**
   * Remove colunas irrelevantes, mantendo apenas os índices 0, 1 e 2 (Nome, ID e Versão).
   *
   * @param {Array<Array<string>>} data - Lista de arrays, onde cada array representa uma linha de dados.
   * @returns {Array<Array<string>>} Lista processada contendo apenas as colunas relevantes.
   */
  private removerColunasIrrelevantes(data: Array<Array<string>>): Array<Array<string>> {
    return data.map((linha) => linha.slice(0, 3));
  }

  /**
   * Segrega os aplicativos em dois grupos: com pacotes completos e com pacotes ausentes ou prejudicados.
   *
   * A função processa os dados de entrada, separando linhas que representam aplicativos com pacotes completos
   * das linhas que indicam aplicativos com ausência ou prejuízo de pacotes, com base em identificadores predefinidos.
   *
   * @private
   * @param {Array<Array<string>>} data - Um array de arrays de strings, onde cada subarray representa uma linha de dados.
   *
   * @returns {PacotesProcessadosType} Um objeto contendo dois grupos de aplicativos:
   * - `appsComPackage`: Um array de arrays de strings contendo as linhas que representam aplicativos com pacotes completos.
   * - `appsPrejudicados`: Um array de arrays de strings contendo as linhas que representam aplicativos com ausência ou prejuízo de pacotes.
   */
  private segregarTiposDeApps(data: Array<Array<string>>): PacotesProcessadosType {
    const appsComPackage: Array<Array<string>> = data.filter((linha) =>
      linha.every(
        (coluna) =>
          !coluna.trim().includes(BadPackagesConst.AUSENCIA_DE_PACOTE) &&
          !coluna.trim().includes(BadPackagesConst.PREJUIZO_DE_PACOTE)
      )
    );

    const appsPrejudicados: Array<Array<string>> = data.filter((linha) =>
      linha.some(
        (texto) =>
          texto.includes(BadPackagesConst.AUSENCIA_DE_PACOTE) || texto.includes(BadPackagesConst.PREJUIZO_DE_PACOTE)
      )
    );

    return { appsComPackage, appsPrejudicados };
  }

  /**
   * Processa os dados formatados, estruturando e segregando os aplicativos com base na sua integridade.
   *
   * @param {string} data - A string contendo os dados formatados em linhas.
   *
   * @returns {PacotesProcessadosType} Um objeto contendo dois grupos de aplicativos:
   * - `appsComPackage`: Um array de arrays de strings contendo as linhas que representam aplicativos com pacotes completos.
   * - `appsPrejudicados`: Um array de arrays de strings contendo as linhas que representam aplicativos com ausência ou prejuízo de pacotes.
   */
  public process(data: string): PacotesProcessadosType {
    let structuredData: Array<Array<string>> = this.estruturarDadosDeLeitura(data);
    structuredData = this.removerColunasIrrelevantes(structuredData);
    return this.segregarTiposDeApps(structuredData);
  }
}
