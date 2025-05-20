import { ArgumentsParserUtils } from './main/application/utils/ArgumentsParserUtils.js';
import { ParsedArgs } from './main/domain/types/ParsedArgs.js';
import { GenerateCommandImpl } from './main/application/commands/GenerateCommandImpl.js';
import { ConsumeCommandImpl } from './main/application/commands/ConsumeCommandImpl.js';
import CLIConst from './main/domain/constants/CLIConst.js';
import GlobalErrorHandler from './main/business/error/GlobalErrorHandler.js';
import CLIService from './main/business/service/CLIService.js';

function main() {
  try {
    const parsed: ParsedArgs = ArgumentsParserUtils.parseArgs(process.argv);
    const app = new CLIService()

    if (parsed.help) {
      console.log(`\n${CLIConst.EXAMPLE}\n`);
      process.exit(0);
    }

    switch (parsed.command) {
      case 'generate':
        new GenerateCommandImpl().run(app)
        break;
      case 'consume':
        new ConsumeCommandImpl(parsed).run(app)
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