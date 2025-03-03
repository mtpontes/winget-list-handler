import ArgumentError from './main/infra/error/errors/ArgumentError.js';
import ArgumentNotSupportedError from './main/infra/error/errors/ArgumentNotSupportedError.js';
import MultipleArgumentsError from './main/infra/error/errors/MultipleArgumentsError.js';
import RequiredArgumentError from './main/infra/error/errors/RequiredArgumentError.js';
import CLIConst from "./main/domain/constants/CLIConst.js";
import GlobalErrorHandler from "./main/infra/error/GlobalErrorHandler.js";
import App from './main/business/App.js';
import CLIUtils from './main/infra/utils/CLIUtils.js';

const app: App = new App()
let args: Array<string> = process.argv;

/**
 * Executa o fluxo principal do programa com base nos argumentos passados via linha de comando.
 * @function run
 * @throws {RequiredArgumentError} Se nenhum ou mais de um argumento obrigatório for fornecido.
 * @throws {ArgumentNotSupportedError} Se argumentos não suportados forem fornecidos.
 * @throws {MultipleArgumentsError} Se múltiplos argumentos de async forem fornecidos.
 * @throws {ArgumentError} Se o valor de concorrência não for numérico ou estiver fora do intervalo permitido.
 */
function run(): void {
  try {
    hasHelp()

    const requiredArg: string | undefined = getRequiredArgument()
    args = removerArgumentosRedundantes(args)

    switch (requiredArg) {
      case CLIConst.GENERATE_FILES_ONLY.required:
        validateArgsForGenerateFileFlux(args)
        app.runGerarArquivos()
        break;

      case CLIConst.CONSUME_FILE.required:
        let asyncArg: string | null = findAsyncArg(args)
        let concurrencyArg: string = findConcurrencyArg(args) as string
        validateArgsForConsumeFileFlux(args, asyncArg!, concurrencyArg)
        runFluxConsumirArquivo(asyncArg, concurrencyArg)
        break;

      default:
        console.log(`\n ${CLIConst.EXAMPLE} \n`)
    }
  } catch (error) {
    GlobalErrorHandler.handle(error as Error);
  }
}

/**
 * Verifica se o argumento de ajuda foi fornecido e exibe a mensagem de exemplo.
 * @function hasHelp
 */
function hasHelp() {
  const hasHelp: boolean = args.some(arg => arg === '--help' || arg === '-h')
  if (hasHelp) {
    console.log(`\n ${CLIConst.EXAMPLE} \n`)
    process.exit(0)
  }
}

/**
 * Obtém o argumento obrigatório fornecido via linha de comando.
 * @function getRequiredArgument
 * @returns {string} O argumento obrigatório encontrado.
 * @throws {RequiredArgumentError} Se nenhum ou mais de um argumento obrigatório for fornecido.
 */
function getRequiredArgument(): string | undefined {
  const requiredArgs: Array<string> = CLIUtils.getRequiredArgs()

  const requiredArgsEncontrados: Array<string> = args.filter(arg => requiredArgs.includes(arg))
  if (requiredArgsEncontrados.length > 1 || requiredArgsEncontrados.length < 1)
    throw new RequiredArgumentError()

  return requiredArgsEncontrados.shift()
}

/**
 * Remove argumentos redundantes da lista de argumentos.
 * @function removerArgumentosRedundantes
 * @param {Array<string>} args - Lista de argumentos.
 * @returns {Array<string>} Lista de argumentos sem os argumentos redundantes.
 */
function removerArgumentosRedundantes(args: Array<string>): Array<string> {
  return args.slice(3); // remove `node index.js <--required-arg>` da lista de argumentos
}

/**
 * Valida os argumentos fornecidos para o fluxo de consumo de arquivo.
 * @function validateArgsForConsumeFileFlux
 * @param {Array<string>} args - Lista de argumentos.
 * @param {string|null} asyncArg - Argumento async, se fornecido.
 * @param {string|null} concurrencyArg - Argumento de concorrência, se fornecido.
 * @throws {MultipleArgumentsError} Se múltiplos argumentos de async forem fornecidos.
 * @throws {ArgumentNotSupportedError} Se argumentos não suportados forem fornecidos.
 */
function validateArgsForConsumeFileFlux(args: Array<string>, asyncArg: string, concurrencyArg: string): void {
  // Se dois argumentos de async forem passados lança erro
  if (asyncArg !== null && concurrencyArg !== null)
    throw new MultipleArgumentsError(CLIConst.MESSAGES.message_2)

  const argumentosSuportados: Array<string> = Object.values(CLIConst.CONSUME_FILE.optional)
  const listaDeArgumentosNaoSuportados: Array<string> = args.filter(arg => {
    arg = arg.includes('concurrency=') ? String(arg.split('=')[0]).concat('=') : arg
    return !argumentosSuportados.includes(arg)
  })

  if (listaDeArgumentosNaoSuportados.length > 0)
    throw new ArgumentNotSupportedError(listaDeArgumentosNaoSuportados)
}

/**
 * Valida os argumentos fornecidos para o fluxo de geração de arquivo.
 * @function validateArgsForGenerateFileFlux
 * @param {Array<string>} args - Lista de argumentos.
 * @throws {ArgumentNotSupportedError} Se argumentos não suportados forem fornecidos.
 */
function validateArgsForGenerateFileFlux(args: Array<string>): void {
  if (args.length > 0)
    throw new ArgumentNotSupportedError(args)
}

/**
 * Encontra o argumento async na lista de argumentos.
 * @function findAsyncArg
 * @param {Array<string>} args - Lista de argumentos.
 * @returns {string|null} O argumento async encontrado ou null se não for fornecido.
 */
function findAsyncArg(args: Array<string>): string | null {
  const index = args.indexOf(CLIConst.CONSUME_FILE.optional.ASYNC)
  return args.indexOf(CLIConst.CONSUME_FILE.optional.ASYNC) !== -1 ?
    args[index]
    :
    null;
};

/**
 * Encontra o argumento de concorrência na lista de argumentos.
 * @function findConcurrencyArg
 * @param {Array<string>} args - Lista de argumentos.
 * @returns {string|null} O argumento de concorrência encontrado ou null se não for fornecido.
 * @throws {MultipleArgumentsError} Se múltiplos argumentos de concorrência forem fornecidos.
 */
function findConcurrencyArg(args: Array<string>): string | null | undefined {
  const concurrencyIndices = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith(CLIConst.CONSUME_FILE.optional.ASYNC_CONCURRENCY)) {
      concurrencyIndices.push(args[i]); // Grava o índice onde ocorre a string esperada
    }
  }

  if (concurrencyIndices.length === 0) return null
  if (concurrencyIndices.length === 1) return concurrencyIndices.shift()
  throw new MultipleArgumentsError(CLIConst.MESSAGES.message_3)
};

/**
 * Verifica se o valor de concorrência é numérico e está dentro do intervalo permitido.
 * @function isValorNumericoValido
 * @param {string} concurrencyArg - Argumento de concorrência.
 * @returns {boolean} True se o valor for válido, caso contrário lança um erro.
 * @throws {ArgumentError} Se o valor de concorrência não for numérico ou estiver fora do intervalo permitido.
 */
function isValorNumericoValido(concurrencyArg: string): boolean {
  const concurrencyValueAsNumber: number = getValorNumerico(concurrencyArg)
  const isNan: boolean = isNaN(concurrencyValueAsNumber)

  if (isNan) throw new ArgumentError(CLIConst.MESSAGES.message_1)
  return concurrencyValueAsNumber > 0 && concurrencyValueAsNumber <= 100
}

function getValorNumerico(concurrencyArg: string): number {
  return Number(concurrencyArg.split('=')[1])
}

/**
 * Executa o fluxo de consumo de arquivo com base nos argumentos fornecidos.
 * @function runFluxConsumirArquivo
 * @param {string|null} asyncArg - Argumento async, se fornecido.
 * @param {string|null} concurrencyArg - Argumento de concorrência, se fornecido.
 */
function runFluxConsumirArquivo(asyncArg: any, concurrencyArg: any): void {
  // Roda de forma síncrona caso não seja passado um argumento async
  if (asyncArg === null && concurrencyArg === null) {
    app.runConsumirArquivo({ isAsync: asyncArg, concurrency: null });
    return
  }

  // async
  if (asyncArg !== null) {
    app.runConsumirArquivo({ isAsync: asyncArg, concurrency: null })
    return
  }

  // async concurrency
  if (concurrencyArg !== null) {
    if (isValorNumericoValido(concurrencyArg)) {
      app.runConsumirArquivo({ isAsync: true, concurrency: getValorNumerico(concurrencyArg) })
      return
    }
  }
}

run()