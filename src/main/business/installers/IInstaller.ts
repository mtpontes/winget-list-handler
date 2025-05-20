import type { AppsType } from "../../domain/types/AppsType.js";
import type { ArgsType } from "../../domain/types/ArgsType.js";

export default interface IInstaller {
  install(packages: Array<AppsType>, args: ArgsType): Promise<void>;
}
