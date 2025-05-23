import { ConsumeCommandImpl } from "./commands/ConsumeCommandImpl";
import { GenerateCommandImpl } from "./commands/GenerateCommandImpl";
import type { ICommand } from "./commands/ICommand";


export class CommandRouter {
  private commandMap: { [key: string]: new () => ICommand; } = {
    'generate': GenerateCommandImpl,
    'consume': ConsumeCommandImpl
  }

  public getCommand(commandKey: string): ICommand {
    const commandClass: any = this.commandMap[commandKey];
    if (!commandClass) {
      throw new Error(`Unknown command: ${commandKey}`);
    }
    return new commandClass();
  }

}