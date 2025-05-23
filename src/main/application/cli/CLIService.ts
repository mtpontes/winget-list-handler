import { ParsedArgs } from "../../domain/types/ParsedArgs"
import { CommandRouter } from "../command/CommandRouter"
import type { ICommand } from "../command/commands/ICommand"
import { ArgumentsParserUtils } from "../utils/ArgumentsParserUtils"


export class CLIService {
  private commandRouter: CommandRouter = new CommandRouter()

  public run(args: string[]): void {
    const parsedArgs: ParsedArgs = ArgumentsParserUtils.parseArgs(args)
    const command: ICommand = this.commandRouter.getCommand(parsedArgs.command)
    command.execute(parsedArgs)
  }
}