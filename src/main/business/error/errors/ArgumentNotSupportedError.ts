export default class ArgumentNotSupportedError extends Error {
  constructor(argumentosNaoSuportados: Array<string>) {
    const message = `
      Unssupported arguments: ' + ${argumentosNaoSuportados.join(", ")}
    `;
    super(message);
  }
}
