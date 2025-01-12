let args = process.argv;
const { runGerarSomenteArquivos, runConsumirArquivo } = require('./src/app');
const { CliArguments } = require('./src/constants/constants');
const handle = require('./src/error/errorHandler');
const { MultipleArgumentsError, ArgumentNotFoundError } = require('./src/error/errors');

/**
* Função principal do CLI que processa os argumentos passados via linha de comando
* e executa ações específicas com base nesses argumentos.
* 
* O script verifica os argumentos fornecidos na linha de comando e, dependendo do valor,
* executa uma das funções predefinidas (`runGerarSomenteArquivos` ou `runConsumirArquivo`).
* Se os argumentos estiverem ausentes ou forem inválidos, são lançados erros específicos
* e tratados pelo handler de erros.
* 
* A execução se dá da seguinte forma:
* - Caso o único argumento seja `CliArguments.GENERATE_FILES_ONLY`, a função `runGerarSomenteArquivos` é executada.
* - Caso o único argumento seja `CliArguments.CONSUME_FILE_ONLY`, a função `runConsumirArquivo` é executada.
* - Caso contrário, um erro é lançado.
* 
* @throws {ArgumentNotFoundError} Se nenhum argumento for fornecido ou o argumento fornecido for inválido.
* @throws {MultipleArgumentsError} Se mais de um argumento for fornecido.
*/
function run() {
  try {
    if (args.length === 2) {
      throw new ArgumentNotFoundError();
    }
    args = args.slice(2);
    if (args.length > 2) {
      throw new MultipleArgumentsError();
    }

    switch (args[0]) {
      case CliArguments.GENERATE_FILES_ONLY:
        runGerarSomenteArquivos();
        break;

      case CliArguments.CONSUME_FILE_ONLY:
        if (args.length > 1) {
          if (args[1] === CliArguments.IS_ASYNC_TRUE) {
            runConsumirArquivo({ isAsync: true });
            return
          }
          if (args[1] === CliArguments.IS_ASYNC_FALSE) {
            runConsumirArquivo({ isAsync: false });
            return
          } else {
            throw new ArgumentNotFoundError();
          }
        }
        runConsumirArquivo({ isAsync: false });
        break;

      default:
        throw new ArgumentNotFoundError();
    }
  } catch (error) {
    handle(error);
  }
}

run()