import type { AppsComPackageType } from "../../infra/types/AppsComPackageType.js";

export default interface Formatter {
  formatarAppsComPacote(data: Array<Array<string>>): Array<AppsComPackageType>;
  formatAppsSemPacote(data: Array<Array<string>>): Array<string>;
}
