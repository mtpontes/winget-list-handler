import ArgumentError from "./errors/ArgumentError.js";
import ArgumentNotSupportedError from "./errors/ArgumentNotSupportedError.js";
import MultipleArgumentsError from "./errors/MultipleArgumentsError.js";
import RequiredArgumentError from "./errors/RequiredArgumentError.js";
import FileNotReadableError from "./errors/FileNotReadableError.js";
import FileNotSupportedError from "./errors/FileNotSupportedError.js";
import InvalidJsonFormat from "./errors/InvalidJsonFormat.js";

export default class GlobalErrorHandler {
  public static handle(error: Error): void {
    switch (error.name) {
      case ArgumentError.name:
        console.log(error.message);
        break;

      case ArgumentNotSupportedError.name:
        console.log(error.message);
        break;

      case MultipleArgumentsError.name:
        console.log(error.message);
        break;

      case RequiredArgumentError.name:
        console.log(error.message);
        break;

      case FileNotReadableError.name:
        console.log(error.message);
        break;

      case FileNotSupportedError.name:
        console.log(error.message);
        break;

      case InvalidJsonFormat.name:
        console.log(error.message);
        break;

      default:
        console.log(error);
    }
  }
}
