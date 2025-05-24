import path from "node:path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import Constants from "../../domain/constants/Constants";
import FileExtensionConst from "../../domain/constants/FileExtensionConst";
import { TypeProcess } from "../../domain/enum/TypeProcess";
import type { AppsType } from "../../domain/types/AppsType";
import FileNotReadableError from "../../business/errors/FileNotReadableError";
import InvalidJsonFormat from "../../business/errors/InvalidJsonFormat";
import type { FormattedPackagesType } from "../../domain/types/FormattedPackagesType";

/**
 * Utility class to deal with file operations related to the Winget list manipulator.
 */
export default class FileUtils {
  /**
   * Creates the directory to dump output files if it doesn't already exist.
   */
  public static createDumpFolder(): void {
    const path = Constants.FOLDER_RESULT_PATH;
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
  }

  public static writeFails(fails: Array<AppsType>) {
    const failsAsText = JSON.stringify(fails, null, 2);
    writeFileSync(this.createOutputPathJson(TypeProcess.FAIL), failsAsText);
  }

  /**
   * Saves the processed application data into JSON report files.
   *
   * @param {Array<AppsType>} appsWithPackage - List of apps with Winget packages.
   * @param {Array<string>} appsWithIssues - List of apps with missing or problematic Winget packages.
   */
  public static recordJsonReports(apps: FormattedPackagesType): void {
    const appsStr: string = JSON.stringify(apps.fmtApps, null, 2);
    const badAppsStr: string = JSON.stringify(apps.fmtBadApps, null, 2);

    writeFileSync(this.createOutputPathJson(TypeProcess.APPS), appsStr);
    writeFileSync(this.createOutputPathJson(TypeProcess.BAD_APPS), badAppsStr);
  }

  private static createOutputPathJson(tipoProcessamento: TypeProcess): string {
    return path.join(Constants.FOLDER_RESULT_PATH, `${tipoProcessamento + FileExtensionConst.JSON}`)
  }

  /**
   * Reads and returns the list of packages from a JSON file.
   * @returns {Array<AppsType>} List of packages.
   * @throws {FileNotReadableError} If the file cannot be read.
   * @throws {InvalidJsonFormat} If the file content is not a valid JSON or is not an array.
   */
  public static getPackages(): Array<AppsType> {
    let filePath: string = Constants.APPS_FILE_PATH;
    try {
      const packagesAsText: string = readFileSync(filePath, { encoding: Constants.UTF_8 });
      const packages: Array<AppsType> = JSON.parse(packagesAsText);
      if (!Array.isArray(packages)) {
        throw new InvalidJsonFormat();
      }

      return packages;

    } catch (error) {
      if (error instanceof InvalidJsonFormat) throw error;
      throw new FileNotReadableError(filePath);
    }
  }
}
