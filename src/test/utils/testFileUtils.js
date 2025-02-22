const path = require('path')
const fs = require('fs');
const FileUtils = require('../../main/utils/FileUtils'); // Ajuste o caminho conforme necessário
const { Constants, TipoProcessamento, FormatoDeArquivo } = require('../../main/constants/constants'); // Ajuste o caminho conforme necessário

const DIRETORIO_DE_TESTE = './src/test/utils/'

describe('FileUtils', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  })

  describe('gravarRelatoriosJson', () => {

    const folderName = 'gerar-arquivo-teste'
    const folderPathTests = path.join(__dirname, folderName);

    beforeEach(() => {
      if (!fs.existsSync(folderPathTests)) fs.mkdirSync(folderPathTests, { recursive: true });
      Constants.FOLDER_RESULT_PATH = DIRETORIO_DE_TESTE + folderName
    })

    afterEach(() => {
      fs.rmSync(folderPathTests, { recursive: true, force: true });
    })

    it('deve gravar os relatórios JSON corretamente', () => {
      // Given
      const appsComPackage = JSON.stringify([{ nome: 'App1', id: '1234', versao: '1.0' }]);
      const appsPrejudicados = JSON.stringify(['app1', 'app2']);

      // When
      FileUtils.gravarRelatoriosJson(appsComPackage, appsPrejudicados);

      // Then
      const caminhoComPackage = path.join(folderPathTests, `${TipoProcessamento.COM_PACKAGE}${FormatoDeArquivo.JSON}`);
      const caminhoPrejudicado = path.join(folderPathTests, `${TipoProcessamento.PREJUDICADO}${FormatoDeArquivo.JSON}`);
      const conteudoComPackage = fs.readFileSync(caminhoComPackage, 'utf8');
      const conteudoPrejudicado = fs.readFileSync(caminhoPrejudicado, 'utf8');
      expect(appsComPackage).toBe(conteudoComPackage)
      expect(appsPrejudicados).toBe(conteudoPrejudicado)
    });
  });
});