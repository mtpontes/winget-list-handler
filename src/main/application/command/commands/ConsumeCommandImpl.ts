import { ICommand } from '../commands/ICommand.js';
import FileUtils from "../../utils/FileUtils";
import type { AppsType } from '../../../domain/types/AppsType.js';
import type { ParsedArgs } from '../../../domain/types/ParsedArgs.js';
import IInstaller from '../../../business/installers/IInstaller.js';
import InstallerImpl from '../../../business/installers/InstallerImpl.js';


export class ConsumeCommandImpl implements ICommand {
  private readonly CONCURRENCY_DEFAULT_VALUE = 5

  constructor(
    private installer: IInstaller = new InstallerImpl()
  ) { }

  async execute(args: ParsedArgs): Promise<void> {
    const packages: Array<AppsType> = FileUtils.getPackages();
    const isAsync = (args.options['async'] as boolean) ?? false;
    const concurrency = (args.options['concurrency'] as number | undefined) ?? this.CONCURRENCY_DEFAULT_VALUE;

    await this.installer.install(packages, { isAsync, concurrency });
  }
}
