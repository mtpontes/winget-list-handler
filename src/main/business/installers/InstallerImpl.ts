import shelljs from "shelljs";
import { Queue } from "async-await-queue";

import type IInstaller from "./IInstaller";
import Constants from "../../domain/constants/Constants";
import type { ArgsType } from "../../infra/types/ArgsType";
import type { AppsType } from "../../infra/types/AppsType";
import FileUtils from "../../infra/utils/FileUtils";
const { exec } = shelljs;

export default class InstallerImpl implements IInstaller {
  /**
   * Installs the packages synchronously, one at a time.
   *
   * @param {Array<AppsType>} packages - List of packages to be installed.
   */
  private installationSync(packages: Array<AppsType>): void {
    for (const pkg of packages) {
      const command = `${Constants.FILE_BAT} ${pkg.id}`;
      console.log(command);

      exec(command, { silent: false });
      console.log("\n");
    }
  }

  /**
   * Installs the packages asynchronously, with concurrency control.
   *
   * @param {Array<AppsType>} packages - List of packages to be installed.
   * @param {number} concurrency - Maximum number of simultaneous installations.
   * @returns {Promise<void>} A Promise that resolves when all packages are installed.
   */
  private async installationAsync(packages: Array<AppsType>, concurrency: number): Promise<void> {
    console.log(`Starting installation of ${packages.length} packages with concurrency of ${concurrency}.`);
    const fails: Array<AppsType> = [];
    const queue = new Queue(concurrency);

    const installPromises = packages.map((pkg, index) =>
      queue.run(async () => {
        const command = `${Constants.FILE_BAT} ${pkg.name}`;
        console.log(
          `${this.indexPackages(index, packages.length)} Starting installation of package ${pkg.name} with the command: ${command}`
        );

        try {
          await new Promise((resolve, reject) => {
            exec(command, { silent: false, async: true }, (code, stdout) => {
              if (code !== Constants.ZERO) {
                console.error(`${this.indexPackages(index, packages.length)} Error installing the package ${pkg.name}:`, code);
                reject(code);
              } else {
                console.log(`${this.indexPackages(index, packages.length)} Package ${pkg.name} installed successfully.`);
                resolve(stdout);
              }
            });
          });
        } catch (error) {
          console.error(`${this.indexPackages(index, packages.length)} Failure to install the package ${pkg.name}.`, error);
          fails.push(pkg);
        }
      })
    );

    await Promise.all(installPromises);
    if (fails.length > 0) FileUtils.writeFails(fails);
  }

  private indexPackages(index: number, totalPackages: number): string {
    return `[Package ${index + 1}/${totalPackages}]`;
  }

  /**
   * Installs the packages based on the execution option (synchronous or asynchronous).
   *
   * @param {Array<AppsType>} packages - List of packages to be installed.
   * @param {Object} args - Installation options.
   * @param {boolean} args.isAsync - If true, the installation will be asynchronous.
   * @param {number} args.concurrency - Maximum number of simultaneous installations (only for asynchronous installation).
   * @returns {Promise<void>} A Promise that resolves when the installation is completed.
   */
  public async install(packages: Array<AppsType>, args: ArgsType): Promise<void> {
    if (!args.isAsync) {
      this.installationSync(packages);
    } else {
      this.installationAsync(packages, args.concurrency!);
    }
  }
}
