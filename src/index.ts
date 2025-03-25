import ArgumentError from './main/infra/error/errors/ArgumentError.js';
import ArgumentNotSupportedError from './main/infra/error/errors/ArgumentNotSupportedError.js';
import MultipleArgumentsError from './main/infra/error/errors/MultipleArgumentsError.js';
import RequiredArgumentError from './main/infra/error/errors/RequiredArgumentError.js';
import CLIConst from "./main/domain/constants/CLIConst.js";
import GlobalErrorHandler from "./main/infra/error/GlobalErrorHandler.js";
import Application from './main/business/Application.js';
import CLIUtils from './main/infra/utils/CLIUtils.js';

const application: Application = new Application()
let args: Array<string> = process.argv;

/**
 * Executes the main program flow based on the command-line arguments provided.
 * @function run
 * @throws {RequiredArgumentError} If no required argument or more than one is provided.
 * @throws {ArgumentNotSupportedError} If unsupported arguments are provided.
 * @throws {MultipleArgumentsError} If multiple async arguments are provided.
 * @throws {ArgumentError} If the concurrency value is not numeric or is out of the allowed range.
 */
function run(): void {
  try {
    hasHelp()

    const requiredArg: string | undefined = getRequiredArgument()
    args = removeRedundantArgs(args)

    switch (requiredArg) {
      case CLIConst.GENERATE_FILES_ONLY.required:
        validateArgsForGenerateFilesFlux(args)
        application.runGenerateFiles()
        break;

      case CLIConst.CONSUME_FILE.required:
        let asyncArg: string | null = findAsyncArg(args)
        let concurrencyArg: string | null = findConcurrencyArg(args) as string
        validateArgsForConsumeFileFlux(args, asyncArg, concurrencyArg)
        runConsumeAppFileFlux(asyncArg, concurrencyArg)
        break;

      default:
        console.log(`\n ${CLIConst.EXAMPLE} \n`)
    }
  } catch (error) {
    GlobalErrorHandler.handle(error as Error);
  }
}

/**
 * Checks if the help argument was provided and displays the example message.
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
 * Retrieves the required argument provided via the command line.
 * @function getRequiredArgument
 * @returns {string} The required argument found.
 * @throws {RequiredArgumentError} If no required argument or more than one is provided.
 */
function getRequiredArgument(): string | undefined {
  const requiredArgs: Array<string> = CLIUtils.getRequiredArgs()

  const requiredArgsFound: Array<string> = args.filter(arg => requiredArgs.includes(arg))
  if (requiredArgsFound.length > 1 || requiredArgsFound.length < 1)
    throw new RequiredArgumentError()

  return requiredArgsFound.shift()
}

/**
 * Removes redundant arguments from the argument list.
 * @function removeRedundantArgs
 * @param {Array<string>} args - List of arguments.
 * @returns {Array<string>} The argument list without redundant arguments.
 */
function removeRedundantArgs(args: Array<string>): Array<string> {
  return args.slice(3); // Removes `node index.js <--required-arg>` from the argument list
}

/**
 * Validates the arguments provided for the file consumption flow.
 * @function validateArgsForConsumeFileFlux
 * @param {Array<string>} args - List of arguments.
 * @param {string|null} asyncArg - Async argument, if provided.
 * @param {string|null|undefined} concurrencyArg - Concurrency argument, if provided.
 * @throws {MultipleArgumentsError} If multiple async arguments are provided.
 * @throws {ArgumentNotSupportedError} If unsupported arguments are provided.
 */
function validateArgsForConsumeFileFlux(args: Array<string>, asyncArg: string | null, concurrencyArg: string | null | undefined): void {
  // Throws an error if multiple async arguments are passed
  if (asyncArg !== null && concurrencyArg !== null)
    throw new MultipleArgumentsError(CLIConst.MESSAGES.message_2);

  const supportedArgs: Array<string> = Object.values(CLIConst.CONSUME_FILE.optional);
  const unsupportedArgs: Array<string> = args.filter(arg => {
    arg = arg.includes('concurrency=') ? String(arg.split('=')[0]).concat('=') : arg;
    return !supportedArgs.includes(arg);
  });

  if (unsupportedArgs.length > 0)
    throw new ArgumentNotSupportedError(unsupportedArgs);
}

/**
 * Validates the arguments provided for the file generation flow.
 * @function validateArgsForGenerateFilesFlux
 * @param {Array<string>} args - List of arguments.
 * @throws {ArgumentNotSupportedError} If unsupported arguments are provided.
 */
function validateArgsForGenerateFilesFlux(args: Array<string>): void {
  if (args.length > 0)
    throw new ArgumentNotSupportedError(args)
}

/**
 * Finds the async argument in the list of arguments.
 * @function findAsyncArg
 * @param {Array<string>} args - List of arguments.
 * @returns {string|null} The async argument found, or null if not provided.
 */
function findAsyncArg(args: Array<string>): string | null {
  const index = args.indexOf(CLIConst.CONSUME_FILE.optional.ASYNC)
  return args.indexOf(CLIConst.CONSUME_FILE.optional.ASYNC) !== -1 ?
    args[index]
    :
    null;
};

/**
 * Finds the concurrency argument in the list of arguments.
 * @function findConcurrencyArg
 * @param {Array<string>} args - List of arguments.
 * @returns {string|null} The concurrency argument found, or null if not provided.
 * @throws {MultipleArgumentsError} If multiple concurrency arguments are provided.
 */
function findConcurrencyArg(args: Array<string>): string | null | undefined {
  const concurrencyIndexes = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith(CLIConst.CONSUME_FILE.optional.ASYNC_CONCURRENCY)) {
      concurrencyIndexes.push(args[i]); // Grava o índice onde ocorre a string esperada
    }
  }

  if (concurrencyIndexes.length === 0) return null
  if (concurrencyIndexes.length === 1) return concurrencyIndexes.shift()
  throw new MultipleArgumentsError(CLIConst.MESSAGES.message_3)
};

/**
 * Checks if the concurrency value is numeric and within the allowed range.
 * @function isValidNumericValue
 * @param {string} concurrencyArg - The concurrency argument.
 * @returns {boolean} True if the value is valid; otherwise, throws an error.
 * @throws {ArgumentError} If the concurrency value is not numeric or is outside the allowed range.
 */
function isValidNumericValue(concurrencyArg: string): boolean {
  const concurrencyValueAsNumber: number = getNumericValue(concurrencyArg)
  const isNan: boolean = isNaN(concurrencyValueAsNumber)

  if (isNan) throw new ArgumentError(CLIConst.MESSAGES.message_1)
  return concurrencyValueAsNumber > 0 && concurrencyValueAsNumber <= 100
}

function getNumericValue(concurrencyArg: string): number {
  return Number(concurrencyArg.split('=')[1])
}

/**
 * Executes the file consumption flow based on the provided arguments.
 * @function runConsumeAppFileFlux
 * @param {string|null} asyncArg - The async argument, if provided.
 * @param {string|null} concurrencyArg - The concurrency argument, if provided.
 */
function runConsumeAppFileFlux(asyncArg: any, concurrencyArg: any): void {
  // Runs synchronously if no async argument is provided
  if (asyncArg === null && concurrencyArg === null) {
    application.runConsumeAppsFile({ isAsync: false, concurrency: null });
    return
  }

  // async
  if (asyncArg !== null) {
    application.runConsumeAppsFile({ isAsync: true, concurrency: null })
    return
  }

  // async concurrency
  if (concurrencyArg !== null) {
    if (isValidNumericValue(concurrencyArg)) {
      application.runConsumeAppsFile({ isAsync: true, concurrency: getNumericValue(concurrencyArg) })
      return
    }
  }
}

run()