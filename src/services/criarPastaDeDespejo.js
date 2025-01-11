const fs = require('fs');

/**
 * Cria o diretório se não existir
 */
function criarPastaDeDespejo(folderPath) {
  if (!fs.existsSync(folderPath))
    fs.mkdirSync(folderPath, { recursive: true })
}

module.exports = criarPastaDeDespejo