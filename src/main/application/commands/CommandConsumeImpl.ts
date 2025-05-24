import { ICommand } from './ICommand.js';
import FileUtils from "../utils/FileUtils.js";
import type { AppsType } from '../../domain/types/AppsType.js';
import type { InstallerOptions } from '../../domain/types/InstallerOptions.js';
import IInstaller from '../../business/installers/IInstaller.js';
import InstallerImpl from '../../business/installers/InstallerImpl.js';


export class CommandConsumeImpl implements ICommand {
  constructor(
    private options: InstallerOptions,
    private installer: IInstaller = new InstallerImpl()
  ) { }

  async execute(): Promise<void> {
    const packages: Array<AppsType> = FileUtils.getPackages();
    await this.installer.install(packages, this.options);
  }
}
