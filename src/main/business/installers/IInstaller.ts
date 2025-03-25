import type { AppsType } from "../../infra/types/AppsType.js";
import type { ArgsType } from "../../infra/types/ArgsType.js";

export default interface IInstaller {
  install(packages: Array<AppsType>, args: ArgsType): Promise<void>;
}
