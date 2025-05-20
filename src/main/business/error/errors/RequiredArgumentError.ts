import CLIUtils from "../../../application/utils/CLIUtils";

export default class RequiredArgumentError extends Error {
  constructor() {
    const message = `
        Invalid or missing required argument. Please provide a valid argument.

        Required arguments: ${CLIUtils.getRequiredArgsFormatted()}

        Only one of the required arguments may be used, and it must always be the first argument passed.
    `;
    super(message);
  }
}
