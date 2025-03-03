import { TipoProcessamento } from "../../../domain/enum/TipoProcessamento";

export default class InvalidJsonFormat extends Error {
  constructor() {
    super(`
        Formato inválido: esperado um array de pacotes. Corrija a formatação do
        arquivo ${TipoProcessamento.COM_PACKAGE}.json ou rode o fluxo de geração 
        de arquivos novamente.
      `);
  }
}
