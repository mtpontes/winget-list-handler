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
        The ${CLIConst.CONSUME_FILE.optional.ASYNC_CONCURRENCY} argument only 
        accepts numbers from 1 to 100 after the '=' character. Inform a value
        Numerical is mandatory when passing this argument.
        
        Use Example: winget-handler ${CLIConst.CONSUME_FILE.optional.ASYNC_CONCURRENCY}5
      `,
    message_2: `
        After the mandatory argument ${CLIConst.CONSUME_FILE.required} 
        It is possible to pass only one of the following arguments:
        
        ${Object.values(CLIConst.CONSUME_FILE.optional).join(", ")}<number>
    `,
    message_3: `
        It is not possible to use more than one argument for asynchronous processing.
        Use only one of the arguments: ${CLIConst.CONSUME_FILE.optional.ASYNC}, ${CLIConst.CONSUME_FILE.optional.ASYNC_CONCURRENCY}
    `,
  };

  static EXAMPLE = `
    Examples:

      Example 1: winget-handler ${CLIConst.GENERATE_FILES_ONLY.required}
      Example 2: winget-handler ${CLIConst.CONSUME_FILE.required}
      Example 3: winget-handler ${CLIConst.CONSUME_FILE.required + " " + CLIConst.CONSUME_FILE.optional.ASYNC}
      Example 4: winget-handler ${CLIConst.CONSUME_FILE.required + " " + CLIConst.CONSUME_FILE.optional.ASYNC_CONCURRENCY + 5
    }
    `;
}
