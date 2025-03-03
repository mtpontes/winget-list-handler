export default class ArgumentNotSupportedError extends Error {
  constructor(argumentosNaoSuportados: Array<string>) {
    const message = `
      Argumentos não suportados: ' + ${argumentosNaoSuportados.join(", ")}
    `;
    super(message);
  }
}
