import type { AppsType } from "../../domain/types/AppsType.js";
import type { InstallerOptions } from "../../domain/types/InstallerOptions.js";

export default interface IInstaller {
  install(packages: Array<AppsType>, args: InstallerOptions): Promise<void>;
}
