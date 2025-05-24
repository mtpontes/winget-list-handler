import { Command } from "commander"
import { InstallerOptions } from "../../domain/types/InstallerOptions"
import { ICommand } from "../commands/ICommand"
import { CommandConsumeImpl } from "../commands/CommandConsumeImpl"
import { ArgumentMapper } from "../mapper/ArgumentMapper"
import { CommandGenerateImpl } from "../commands/CommandGenerateImpl"

export class CLIController {
  private commander: Command = new Command()
  private mapper: ArgumentMapper = new ArgumentMapper()

  public registryCommands(args: Array<string>): void {
    this.consumeFile()
    this.generateFiles()
    this.commander.parse(args)
  }

  private generateFiles() {
    this.commander
      .command('generate-files')
      .showHelpAfterError(true)
      .description('Generates the apps.json and badapp files regarding application packages recognized by Winget')
      .action(() => {
        try {
          const command: ICommand = new CommandGenerateImpl()
          command.execute()
        } catch (error: any) {
          this.commander.outputHelp()
          this.commander.error('\n' + error.message + '\n')
        }
      });
  }

  private consumeFile() {
    this.commander
      .command('consume-file')
      .description('Install applications listed in the Apps.json file ')
      .option('--async', 'Installs applications asynchronously')
      .option('--async-jobs <number>', 'Defines the number of simultaneous installations (1–100)')
      .action((options) => {
        try {
          const opt: InstallerOptions = this.mapper.parseOptionsConsumeFile(options)

          const command: ICommand = new CommandConsumeImpl(opt)
          command.execute()
        } catch (error: any) {
          this.commander.outputHelp()
          this.commander.error('\n' + error.message + '\n')
        }
      })
      .showHelpAfterError(true)
  }
}