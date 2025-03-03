import CLIUtils from "../../utils/CLIUtils";

export default class RequiredArgumentError extends Error {
  constructor() {
    const message = `
      Argumento obrigatório inválido ou ausente. Informe um argumento válido.

      Argumentos obrigatórios: ${CLIUtils.getRequiredArgsFormatted()}
      
      Só é possível usar um dos argumentos obrigatórios e ele sempre deve ser o primeiro argumento a ser passado.
    `;
    super(message);
  }
}
