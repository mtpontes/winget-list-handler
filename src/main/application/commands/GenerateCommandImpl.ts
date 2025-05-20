import CLIService from '../../business/service/CLIService.js';
import { ICommand } from './ICommand.js';

export class GenerateCommandImpl implements ICommand {
  run(app: CLIService): void {
    app.runGenerateFiles();
  }
}