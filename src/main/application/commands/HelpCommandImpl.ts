import CLIService from '../../business/service/CLIService.js';
import type { ParsedArgs } from '../../domain/types/ParsedArgs.js';
import { ICommand } from './ICommand.js';

export class ConsumeCommandImpl implements ICommand {
  constructor(
    private parsedArgs: ParsedArgs
  ) { }

  run(app: CLIService): void {
    app.runConsumeAppsFile({
      isAsync: this.parsedArgs.async,
      concurrency: this.parsedArgs.concurrency,
    });

  }
}
