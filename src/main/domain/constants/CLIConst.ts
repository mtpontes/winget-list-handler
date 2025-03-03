export default class CLIConst {
  static GENERATE_FILES_ONLY = {
    required: "--generate-files",
  };

  static CONSUME_FILE = {
    required: "--consume-file",
    optional: {
      ASYNC: "--async",
      ASYNC_CONCURRENCY: "--async-concurrency=",
    },
  };

  static MESSAGES = {
    message_1: `
        O argumento ${CLIConst.CONSUME_FILE.optional.ASYNC_CONCURRENCY}
        aceita somente números de 1 a 100 após o caractere '='. Informar um valor
        numérico é obrigatório ao passar esse argumento.
        
        Exemplo de uso: node index.js ${CLIConst.CONSUME_FILE.optional.ASYNC_CONCURRENCY}5
      `,
    message_2: `
        Após o argumento obrigatório ${CLIConst.CONSUME_FILE.required} 
        é possível passar apenas um dos seguintes argumentos:
        
        ${Object.values(CLIConst.CONSUME_FILE.optional).join(", ")}<number>
    `,
    message_3: `
        Não é possível usar mais de um argumento para o processamento assíncrono.
        Utilize somente um dos argumentos: ${CLIConst.CONSUME_FILE.optional.ASYNC}, ${CLIConst.CONSUME_FILE.optional.ASYNC_CONCURRENCY}
    `,
  };

  static EXAMPLE = `
    Exemplos:

      Exemplo 1: node index.js ${CLIConst.GENERATE_FILES_ONLY.required}
      Exemplo 2: node index.js ${CLIConst.CONSUME_FILE.required}
      Exemplo 3: node index.js ${CLIConst.CONSUME_FILE.required + " " + CLIConst.CONSUME_FILE.optional.ASYNC}
      Exemplo 4: node index.js ${
        CLIConst.CONSUME_FILE.required + " " + CLIConst.CONSUME_FILE.optional.ASYNC_CONCURRENCY + 5
      }
    `;
}
