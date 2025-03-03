import path from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import Constants from '../../../main/domain/constants/Constants';
import FileExtensionConst from '../../../main/domain/constants/FileExtensionConst';
import { TipoProcessamento } from '../../../main/domain/enum/TipoProcessamento';
import type { AppsComPackageType } from '../../../main/infra/types/AppsComPackageType';
import FileUtils from '../../../main/infra/utils/FileUtils'
import InvalidJsonFormat from '../../../main/infra/error/errors/InvalidJsonFormat';
import FileNotReadableError from '../../../main/infra/error/errors/FileNotReadableError';
import type { PacotesFormatadosType } from '../../../main/infra/types/PacotesFormatados';

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
      if (!existsSync(folderPathTests)) mkdirSync(folderPathTests, { recursive: true });
      Constants.FOLDER_RESULT_PATH = DIRETORIO_DE_TESTE + folderName
    })

    afterEach(() => {
      rmSync(folderPathTests, { recursive: true, force: true });
    })

    it('deve gravar os relatórios JSON corretamente', () => {
      // Given
      const entrada: PacotesFormatadosType = {
        appsComPackage: [{ nome: 'App1', id: '1234', version: '1.0' }],
        appsPrejudicados: ['app1', 'app2']
      }

      const expectComPackage: string = JSON.stringify(entrada.appsComPackage, null, 2)
      const expectSemPackage: string = JSON.stringify(entrada.appsPrejudicados, null, 2)

      // When

      FileUtils.gravarRelatoriosJson(entrada);
      const caminhoComPackage: string = path.join(folderPathTests, `${TipoProcessamento.COM_PACKAGE}${FileExtensionConst.JSON}`);
      const caminhoPrejudicado: string = path.join(folderPathTests, `${TipoProcessamento.PREJUDICADO}${FileExtensionConst.JSON}`);
      const conteudoComPackage: string = readFileSync(caminhoComPackage, 'utf8');
      const conteudoPrejudicado: string = readFileSync(caminhoPrejudicado, 'utf8');

      // Then
      expect(conteudoComPackage).toEqual(expectComPackage)
      expect(conteudoPrejudicado).toEqual(expectSemPackage)
    });
  });

  describe('FileUtils - getPackages', () => {
    const folderName = 'get-packages-test';
    const folderPathTests = path.join(__dirname, folderName);

    beforeEach(() => {
      if (!existsSync(folderPathTests)) mkdirSync(folderPathTests, { recursive: true });
      Constants.FOLDER_RESULT_PATH = folderPathTests;
    });

    afterEach(() => {
      rmSync(folderPathTests, { recursive: true, force: true });
    });

    it('deve retornar a lista de pacotes corretamente quando o arquivo JSON é válido', () => {
      // Given
      Constants.APPS_FILE_PATH = path.join(folderPathTests, `${TipoProcessamento.COM_PACKAGE}${FileExtensionConst.JSON}`)
      const expectedPackages: Array<AppsComPackageType> = [
        { nome: 'App1', id: '1234', version: '1.0' },
        { nome: 'App2', id: '5678', version: '2.0' },
      ];
      const filePath = path.join(folderPathTests, `${TipoProcessamento.COM_PACKAGE}${FileExtensionConst.JSON}`);
      writeFileSync(filePath, JSON.stringify(expectedPackages, null, 2));

      // When
      const packages = FileUtils.getPackages();

      // Then
      expect(packages).toEqual(expectedPackages);
    });

    it('deve lançar InvalidJsonFormat quando o conteúdo do arquivo não é um array', () => {
      // Given
      const invalidJsonContent = { nome: 'App1', id: '1234', version: '1.0' };
      const filePath = path.join(folderPathTests, `${TipoProcessamento.COM_PACKAGE}${FileExtensionConst.JSON}`);
      writeFileSync(filePath, JSON.stringify(invalidJsonContent, null, 2));

      // When / Then
      expect(() => FileUtils.getPackages()).toThrow(InvalidJsonFormat);
    });

    it('deve lançar FileNotReadableError quando o arquivo não pode ser lido', () => {
      // Given
      const nonExistentFilePath = path.join(folderPathTests, 'non-existent-file.json');

      // When / Then
      expect(() => FileUtils.getPackages()).toThrow(FileNotReadableError);
    });
  });
});