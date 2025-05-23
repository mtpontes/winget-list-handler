import { ArgumentsParserUtils } from './main/application/utils/ArgumentsParserUtils.js';
import { ParsedArgs } from './main/domain/types/ParsedArgs.js';
import { GenerateCommandImpl } from './main/application/commands/GenerateCommandImpl.js';
import { ConsumeCommandImpl } from './main/application/commands/ConsumeCommandImpl.js';
import CLIConst from './main/domain/constants/CLIConst.js';
import GlobalErrorHandler from './main/business/error/GlobalErrorHandler.js';
import type { ICommand } from './main/application/commands/ICommand.js';


function main() {
  try {
    const parsed: ParsedArgs = ArgumentsParserUtils.parseArgs(process.argv);

    const generateCommand: ICommand = new GenerateCommandImpl()
    const consumeCommand: ICommand = new ConsumeCommandImpl(parsed)


    if (parsed.help) {
      console.log(`\n${CLIConst.EXAMPLE}\n`);
      process.exit(0);
    }

    switch (parsed.command) {
      case 'generate':
        generateCommand.run()
        break;
      case 'consume':
        consumeCommand.run()
        break;
      default:
        console.log(`\n${CLIConst.EXAMPLE}\n`);
        process.exit(1);
    }
  } catch (error) {
    GlobalErrorHandler.handle(error as Error);
    process.exit(1);
  }
}

main();