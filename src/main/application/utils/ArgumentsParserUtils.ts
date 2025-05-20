import CLIConst from '../../domain/constants/CLIConst.js';
import { ParsedArgs } from '../../domain/types/ParsedArgs.js';


export class ArgumentsParserUtils {
  static parseArgs(argv: string[]): ParsedArgs {
    const args = argv.slice(2);

    const help = args.includes('--help') || args.includes('-h');
    let command: 'generate' | 'consume' | null = null;
    let async = false;
    let concurrency: number | null = null;

    if (args.includes(CLIConst.GENERATE_FILES_ONLY.required)) {
      command = 'generate';
    } else if (args.includes(CLIConst.CONSUME_FILE.required)) {
      command = 'consume';
    }

    if (args.includes(CLIConst.CONSUME_FILE.optional.ASYNC)) {
      async = true;
    }

    const concurrencyArg = args.find(arg => arg.startsWith(CLIConst.CONSUME_FILE.optional.ASYNC_CONCURRENCY));
    if (concurrencyArg) {
      const value = Number(concurrencyArg.split('=')[1]);
      if (isNaN(value) || value < 1 || value > 100) {
        throw new Error('Valor de concorrência inválido');
      }
      concurrency = value;
      async = true;
    }

    return { command, help, async, concurrency };
  }

}
