import CLIConst from "../../domain/constants/CLIConst";

export default class CLIUtils {
  static getRequiredArgs(): Array<string> {
    return [CLIConst.GENERATE_FILES_ONLY.required, CLIConst.CONSUME_FILE.required];
  }

  static getRequiredArgsFormatted(): string {
    return [CLIConst.GENERATE_FILES_ONLY.required, CLIConst.CONSUME_FILE.required].join(", ");
  }
}
