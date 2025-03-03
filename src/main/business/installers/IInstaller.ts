import type { AppsComPackageType } from "../../infra/types/AppsComPackageType.js";
import type { ArgsType } from "../../infra/types/ArgsType.js";

export default interface IInstaller {
  install(packages: Array<AppsComPackageType>, args: ArgsType): Promise<void>;
}
