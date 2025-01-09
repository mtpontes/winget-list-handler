const fs = require('fs')
const path = require('path');
const shell = require('shelljs')
const { Constants } = require('../constants/constants')
const {
  FileNotReadableError,
  FileNotFoundError } = require('../error/errors')

async function instalarPacotes() {
  try {
    const caminhoArquivo = path.resolve(__dirname, Constants.CAMINHO_DO_ARQUIVO_DE_APPS_COM_PACOTES_GERADO)

    try {
      const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
      const pacotes = JSON.parse(conteudo); // Converte o JSON string para objeto
  
      for (let index = 0; index < pacotes.length; index++) {
        const comando = `${Constants.CAMINHO_ARQUIVO_BAT} ${pacotes[index].id}`;
        console.log(comando);
    
        const result = await shell.exec(comando.slice(3), { silent: false });
        console.log('\n')
      }
    } catch (error) {
      // TODO: Tratar com um log mais amigavel
      throw new FileNotReadableError('Erro ao ler arquivo', error)
    }
  } catch (error) {
    if (error instanceof FileNotReadableError) throw error
    throw new FileNotFoundError('Não foi possivel encontrar o arquivo apps-com-pacotes.json. Certifique-se de já ter criado o arquivo anteriormente.', error)
  }
}

module.exports = instalarPacotes