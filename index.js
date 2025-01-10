let args = process.argv;
const { runFluxoCompleto, runGerarSomenteArquivos, runConsumirArquivo } = require('./src/app')
const { CliArguments } = require('./src/constants/constants')
const handle = require('./src/error/errorHandler')
const { 
  MultipleArgumentsError, 
  ArgumentNotFoundError, 
  FileNotReadableError, 
  FileNotFoundError } = require('./src/error/errors')

try {
  if (args.length === 2) {
    throw new ArgumentNotFoundError()
  }
  args = args.slice(2)
  if (args.length > 1) {
    throw new MultipleArgumentsError();
  }
  
  switch (args[0]) {
    case CliArguments.GENERATE_FILES_ONLY:
      runGerarSomenteArquivos()
      break
  
    case CliArguments.CONSUME_FILE_ONLY:
      runConsumirArquivo()
      break
  
    default:
      throw new ArgumentNotFoundError() 
  }
} catch (error) {
  handle(error)
}