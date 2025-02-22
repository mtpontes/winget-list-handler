const {
  ArgumentError,
  ArgumentNotSupportedError,
  MultipleArgumentsError,
  RequiredArgumentError,
  FileNotReadableError,
  FileNotSupportedError,
  InvalidJsonFormat } = require('./errors')

function handle(error) {
  switch (error.name) {
    case ArgumentError.name:
      console.log(error.message)
      break;

    case ArgumentNotSupportedError.name:
      console.log(error.message)
      break;

    case MultipleArgumentsError.name:
      console.log(error.message)
      break;

    case RequiredArgumentError.name:
      console.log(error.message)
      break;

    case FileNotReadableError.name:
      console.log(error.message)
      break;

    case FileNotSupportedError.name:
      console.log(error.message)
      break;

    case InvalidJsonFormat.name:
      console.log(error.message)
      break;

    default:
      console.log(error)
  }
}

module.exports = handle;