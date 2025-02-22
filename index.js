const { runGerarSomenteArquivos, runConsumirArquivo } = require('./src/main/app');
const { CLIConstants } = require('./src/main/constants/constants');
const {
  MultipleArgumentsError,
  ArgumentNotSupportedError,
  RequiredArgumentError,
  ArgumentError
} = require('./src/main/error/errors');
const handle = require('./src/main/error/errorHandler');

let args = process.argv;

/**
 * Executa o fluxo principal do programa com base nos argumentos passados via linha de comando.
 * @function run
 * @throws {RequiredArgumentError} Se nenhum ou mais de um argumento obrigatório for fornecido.
 * @throws {ArgumentNotSupportedError} Se argumentos não suportados forem fornecidos.
 * @throws {MultipleArgumentsError} Se múltiplos argumentos de async forem fornecidos.
 * @throws {ArgumentError} Se o valor de concorrência não for numérico ou estiver fora do intervalo permitido.
 */
function run() {
  try {
    hasHelp()

    const requiredArg = getRequiredArgument()
    args = removerArgumentosRedundantes(args)

    switch (requiredArg) {
      case CLIConstants.GENERATE_FILES_ONLY.required:
        validateArgsForGenerateFileFlux(args)
        runGerarSomenteArquivos()
        break;

      case CLIConstants.CONSUME_FILE_ONLY.required:
        let asyncArg = findAsyncArg(args)
        let concurrencyArg = findConcurrencyArg(args)
        validateArgsForConsumeFileFlux(args, asyncArg, concurrencyArg)
        runFluxConsumirArquivo(asyncArg, concurrencyArg)
        break;

      default:
        console.log(`\n ${CLIConstants.EXAMPLE} \n`)
    }
  } catch (error) {
    handle(error);
  }
}

/**
 * Verifica se o argumento de ajuda foi fornecido e exibe a mensagem de exemplo.
 * @function hasHelp
 */
function hasHelp() {
  const hasHelp = args.some(arg => arg === '--help' || arg === '-h')
  if (hasHelp) {
    console.log(`\n ${CLIConstants.EXAMPLE} \n`)
    process.exit(0)
  }
}

/**
 * Obtém o argumento obrigatório fornecido via linha de comando.
 * @function getRequiredArgument
 * @returns {string} O argumento obrigatório encontrado.
 * @throws {RequiredArgumentError} Se nenhum ou mais de um argumento obrigatório for fornecido.
 */
function getRequiredArgument() {
  const requiredArgs = CLIConstants.getRequiredArgs()

  const requiredArgsEncontrados = args.filter(arg => requiredArgs.includes(arg))
  if (requiredArgsEncontrados.length > 1 || requiredArgsEncontrados.length < 1)
    throw new RequiredArgumentError()

  return requiredArgsEncontrados.shift()
}

/**
 * Remove argumentos redundantes da lista de argumentos.
 * @function removerArgumentosRedundantes
 * @param {string[]} args - Lista de argumentos.
 * @returns {string[]} Lista de argumentos sem os argumentos redundantes.
 */
function removerArgumentosRedundantes(args) {
  return args.slice(3); // remove `node index.js <--required-arg>` da lista de argumentos
}

/**
 * Valida os argumentos fornecidos para o fluxo de consumo de arquivo.
 * @function validateArgsForConsumeFileFlux
 * @param {string[]} args - Lista de argumentos.
 * @param {string|null} asyncArg - Argumento async, se fornecido.
 * @param {string|null} concurrencyArg - Argumento de concorrência, se fornecido.
 * @throws {MultipleArgumentsError} Se múltiplos argumentos de async forem fornecidos.
 * @throws {ArgumentNotSupportedError} Se argumentos não suportados forem fornecidos.
 */
function validateArgsForConsumeFileFlux(args, asyncArg, concurrencyArg) {
  // Se dois argumentos de async forem passados lança erro
  if (asyncArg !== null && concurrencyArg !== null)
    throw new MultipleArgumentsError(CLIConstants.MESSAGES.message_2)

  const argumentosSuportados = Object.values(CLIConstants.CONSUME_FILE_ONLY.optional)
  const listaDeArgumentosNaoSuportados = args.filter(arg => {
    arg = arg.includes('concurrency=') ? String(arg.split('=')[0]).concat('=') : arg
    return !argumentosSuportados.includes(arg)
  })

  if (listaDeArgumentosNaoSuportados.length > 0)
    throw new ArgumentNotSupportedError()
}

/**
 * Valida os argumentos fornecidos para o fluxo de geração de arquivo.
 * @function validateArgsForGenerateFileFlux
 * @param {string[]} args - Lista de argumentos.
 * @throws {ArgumentNotSupportedError} Se argumentos não suportados forem fornecidos.
 */
function validateArgsForGenerateFileFlux(args) {
  if (args.length > 0)
    throw new ArgumentNotSupportedError()
}

/**
 * Encontra o argumento async na lista de argumentos.
 * @function findAsyncArg
 * @param {string[]} args - Lista de argumentos.
 * @returns {string|null} O argumento async encontrado ou null se não for fornecido.
 */
function findAsyncArg(args) {
  const index = args.indexOf(CLIConstants.CONSUME_FILE_ONLY.optional.ASYNC)
  return args.indexOf(CLIConstants.CONSUME_FILE_ONLY.optional.ASYNC) !== -1 ?
    args[index]
    :
    null;
};

/**
 * Encontra o argumento de concorrência na lista de argumentos.
 * @function findConcurrencyArg
 * @param {string[]} args - Lista de argumentos.
 * @returns {string|null} O argumento de concorrência encontrado ou null se não for fornecido.
 * @throws {MultipleArgumentsError} Se múltiplos argumentos de concorrência forem fornecidos.
 */
function findConcurrencyArg(args) {
  const concurrencyIndices = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith(CLIConstants.CONSUME_FILE_ONLY.optional.ASYNC_CONCURRENCY)) {
      concurrencyIndices.push(args[i]); // Grava o índice onde ocorre a string esperada
    }
  }

  if (concurrencyIndices.length === 0) return null
  if (concurrencyIndices.length === 1) return concurrencyIndices.shift()
  throw new MultipleArgumentsError()
};

/**
 * Verifica se o valor de concorrência é numérico e está dentro do intervalo permitido.
 * @function isValorNumericoValido
 * @param {string} concurrencyArg - Argumento de concorrência.
 * @returns {boolean} True se o valor for válido, caso contrário lança um erro.
 * @throws {ArgumentError} Se o valor de concorrência não for numérico ou estiver fora do intervalo permitido.
 */
function isValorNumericoValido(concurrencyArg) {
  const concurrencyValueAsNumber = Number(concurrencyArg.split('=')[1])
  const isNan = isNaN(concurrencyValueAsNumber)

  if (isNan) throw new ArgumentError(CLIConstants.CONSUME_FILE_ONLY.messages.message_1)
  return concurrencyValueAsNumber > 0 && concurrencyValueAsNumber <= 100
}

/**
 * Executa o fluxo de consumo de arquivo com base nos argumentos fornecidos.
 * @function runFluxConsumirArquivo
 * @param {string|null} asyncArg - Argumento async, se fornecido.
 * @param {string|null} concurrencyArg - Argumento de concorrência, se fornecido.
 */
function runFluxConsumirArquivo(asyncArg, concurrencyArg) {
  // Roda de forma síncrona caso não seja passado um argumento async
  if (asyncArg === null && concurrencyArg === null) return runConsumirArquivo({ isAsync: asyncArg });

  // async
  if (asyncArg !== null) return runConsumirArquivo({ isAsync: asyncArg })

  // async concurrency
  if (concurrencyArg !== null)
    if (isValorNumericoValido(concurrencyArg)) {
      return runConsumirArquivo({ isAsync: true, concurrency: concurrencyValueAsNumber })
    }
}

run()