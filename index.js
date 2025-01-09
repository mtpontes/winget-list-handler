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
    runFluxoCompleto()
    return
  }
  args = args.slice(2)
  if (args.length > 1) {
    const logMessage = { 
      erro: 'Multiplos argumentos não suportado. Passe apenas um argumento.', 
      message: 'Uso: node index.js <seu-argumento-aqui>'
    }
  
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