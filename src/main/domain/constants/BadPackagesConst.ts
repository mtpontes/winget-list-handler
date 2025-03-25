/**
 * Class that defines standard textual identifiers used to categorize data.
 */
export default class BadPackagesConst {
  /**
   * Textual identifier representing the absence of a package in the app.
   *
   * Typically corresponds to the term `ARP`, indicating that an application lacks a complete package.
   * @type {string}
   */
  static MISSING_PACKAGE = "ARP";

  /**
   * Textual identifier representing packages damaged by the ellipsis character (`…`)
   * added by winget in case of very long names.
   *
   * Typically applies only to internal Windows packages.
   *
   * Indicates that there is an issue or limitation with the application's package.
   * @type {string}
   */
  static BROKEN_PACKAGE = "…";
}
