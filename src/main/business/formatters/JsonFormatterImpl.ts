import IFormatter from "./IFormatter.js";
import type { AppsType as AppsType } from "../../infra/types/AppsType.js";

export default class JsonFormatterImpl implements IFormatter {
  /**
   * Converts the list of apps with full packages into an array of formatted objects.
   *
   * @param {Array<Array<string>>} withPackage - The list of apps, where each item contains the name, ID, and optionally, the version.
   * @returns {Array<AppsType>} List of objects representing the apps with full packages.
   *
   * @example
   * const apps = [
   *   ["App1", "12345", "1.0.0"],
   *   ["App2", "67890"]
   * ];
   * formatApps(apps);
   * // Returns:
   * // [
   * //   { "name": "App1", "id": "12345", "version": "1.0.0" },
   * //   { "name": "App2", "id": "67890", "version": null }
   * // ]
   */
  public formatApps(withPackage: Array<Array<string>>): Array<AppsType> {
    return withPackage
      .map(([name, id, version = null]) => ({ name, id, version }))
      .filter(({ name }) => name?.trim());
  }

  /**
   * Converts the list of broken apps into a formatted array of strings.
   *
   * @param {Array<Array<string>>} bad - List of broken apps, containing only the name of each app.
   * @returns {Array<string>} List of names of the broken apps.
   *
   * @example
   * const apps = [
   *   ["App1"],
   *   ["App2"],
   *   [""]  // Empty name will be ignored
   * ];
   * formatBadApps(apps);
   * // Returns:
   * // [
   * //   "App1",
   * //   "App2"
   * // ]
   */
  public formatBadApps(bad: Array<Array<string>>): Array<string> {
    return bad.map(([name]) => name).filter((line) => line.trim());
  }
}
