import { TypeProcess } from "../../../domain/enum/TypeProcess";

export default class InvalidJsonFormat extends Error {
  constructor() {
    super(`
        Invalid format: expected an array of packages. Please correct the formatting of the
        ${TypeProcess.APPS}.json file or run the file generation
        flow again.
      `);
  }
}
