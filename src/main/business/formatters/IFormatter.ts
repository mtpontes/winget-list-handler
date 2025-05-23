import type { AppsType } from "../../domain/types/AppsType.js";

export default interface Formatter {
  formatApps(data: Array<Array<string>>): Array<AppsType>;
  formatBadApps(data: Array<Array<string>>): Array<string>;
}
