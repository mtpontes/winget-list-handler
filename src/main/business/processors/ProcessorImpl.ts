import IProcessor from "./IProcessor";
import Constants from "../../domain/constants/Constants";
import BadPackagesConst from "../../domain/constants/BadPackagesConst";
import { ProcessedPackagesType } from "../../infra/types/ProcessedPackagesType";

/**
 *Class responsible for processing formatted text data, extracting useful information
 *and segregating applications with complete packages and those with absent or impaired packages.
 */
export default class ProcessorImpl implements IProcessor {
  /**
   * Filters and structures formatted data into an array of arrays of strings.
   *
   * The function identifies where the useful data starts by ignoring headers and separators,
   * and processes each relevant line by splitting the text based on two or more consecutive spaces.
   *
   * @private
   * @param {string} data - The input string containing formatted data in lines.
   *
   * @returns {Array<Array<string>>} An array of arrays of strings, where each subarray
   * represents a useful line from the input, with the text split into columns.
   */
  private structureReadingData(data: string): Array<Array<string>> {
    let rows: Array<string> = data.split("\n");
    const indexOfStartOfUsefulData = rows.findIndex((row) => row.includes(Constants.ID));
    return rows
      .slice(indexOfStartOfUsefulData + 2) // Removes redundant artifacts
      .map((row) => row.split(/\s{2,}/)) // Break the lines in columns
      .map((row) => row.slice(0, 3)) // Remove redundant columns
  }

  /**
   * Segregates the applications into two groups: those with complete packages and those with missing or broken packages.
   *
   * The function processes the input data, separating lines that represent applications with complete packages
   * from lines indicating applications with missing or broken packages, based on predefined identifiers.
   *
   * @private
   * @param {Array<Array<string>>} data - An array of arrays of strings, where each subarray represents a data line.
   *
   * @returns {ProcessedPackagesType} An object containing two groups of applications:
   * - `appsWithPackage`: An array of arrays of strings containing the lines representing applications with complete packages.
   * - `appsWithIssues`: An array of arrays of strings containing the lines representing applications with missing or broken packages.
   */
  private segregateAppTypes(data: Array<Array<string>>): ProcessedPackagesType {
    const pcdApps: Array<Array<string>> = data.filter((line) =>
      line.every((column) =>
        !column.trim().includes(BadPackagesConst.MISSING_PACKAGE) &&
        !column.trim().includes(BadPackagesConst.BROKEN_PACKAGE)
      )
    );

    const pcdBadApps: Array<Array<string>> = data.filter((line) =>
      line.some((text) =>
        text.includes(BadPackagesConst.MISSING_PACKAGE) ||
        text.includes(BadPackagesConst.BROKEN_PACKAGE)
      )
    );

    return { pcdApps, pcdBadApps } as ProcessedPackagesType;
  }

  /**
   * Processes the formatted data, structuring and segregating applications based on their integrity.
   *
   * @param {string} data - A string containing the formatted data in lines.
   *
   * @returns {ProcessedPackagesType} An object containing two groups of applications:
   * - `appsWithPackage`: An array of arrays of strings containing the lines representing applications with complete packages.
   * - `appsWithIssues`: An array of arrays of strings containing the lines representing applications with missing or broken packages.
   */
  public process(data: string): ProcessedPackagesType {
    const structuredData: Array<Array<string>> = this.structureReadingData(data);
    return this.segregateAppTypes(structuredData) as ProcessedPackagesType;
  }
}
