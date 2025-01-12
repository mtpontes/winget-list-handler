const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { Constants } = require('../constants/constants');
const {
  FileNotReadableError,
  FileNotFoundError,
} = require('../error/errors');

async function instalarPacotes() {
  try {
    const filePath = path.resolve(__dirname, Constants.CAMINHO_DO_ARQUIVO_DE_APPS_COM_PACOTES_GERADO);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const packages = JSON.parse(content); // Converte o JSON string para objeto

      for (let index = 0; index < packages.length; index++) {
        const command = `${Constants.CAMINHO_ARQUIVO_BAT} ${packages[index].id}`;
        console.log(command);

        shell.exec(command.slice(3), { silent: false });
        console.log('\n');
      }
    } catch (error) {
      throw new FileNotReadableError();
    }
  } catch (error) {
    if (error instanceof FileNotReadableError) throw error;
    throw new FileNotFoundError();
  }
}

module.exports = instalarPacotes;
