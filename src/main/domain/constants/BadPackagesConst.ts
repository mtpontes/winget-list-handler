/**
 * Classe que define identificadores textuais padrão usados para categorizar dados.
 */
export default class BadPackagesConst {
  /**
   * Identificador textual que representa a ausência de pacote no app.
   *
   * Geralmente corresponde ao termo `ARP`, indicando que um aplicativo não possui um pacote completo.
   * @type {string}
   */
  static AUSENCIA_DE_PACOTE = "ARP";

  /**
   * Identificador textual que representa pacotes prejudicados pelo caractere de elipsis (`…`)
   * adicionado pelo winget em caso de nomes muito longos.
   *
   * Normalmente só se aplica a pacotes internos do Windows.
   *
   * Indica que há algum problema ou limitação no pacote do aplicativo.
   * @type {string}
   */
  static PREJUIZO_DE_PACOTE = "…";
}
