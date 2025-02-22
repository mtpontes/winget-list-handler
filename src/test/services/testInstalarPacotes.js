const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const instalarPacotes = require('../../main/services/instalarPacotes');
const { Constants } = require('../../main/constants/constants');
const { FileNotReadableError, InvalidJsonFormat } = require('../../main/error/errors');
const { type } = require('os');

jest.mock('fs');
jest.mock('path');
jest.mock('shelljs');
jest.mock('async-await-queue');

describe('instalarPacotes', () => {
  const mockPackages = [{ nome: "Pacote1", id: 'package1' }, { nome: "Pacote1", id: 'package2' }];
  const mockFilePath = path.resolve(Constants.CAMINHO_DO_ARQUIVO_DE_APPS_COM_PACOTES_GERADO);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve instalar pacotes de forma síncrona quando isAsync é false', () => {
    // Given
    fs.readFileSync.mockReturnValue(JSON.stringify(mockPackages));
    shell.exec = jest.fn(() => ({ code: 0 }));

    // When
    instalarPacotes({ isAsync: false });

    // Then
    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, { encoding: Constants.UTF_8 });
    expect(shell.exec).toHaveBeenCalledTimes(mockPackages.length);
    mockPackages.forEach(pkg => {
      expect(shell.exec).toHaveBeenCalledWith(`${Constants.ARQUIVO_BAT} ${pkg.id}`, { silent: false });
    });
  });


  test('deve lançar FileNotReadableError se o arquivo não puder ser lido', async () => {
    // Given
    fs.readFileSync.mockImplementation(() => { throw new FileNotReadableError(); });

    // When & Then
    await expect(instalarPacotes({ isAsync: false })).rejects.toThrow(FileNotReadableError);
  });

  test('deve lançar InvalidJsonFormat se o conteúdo do arquivo não for um JSON válido ou não for um array', async () => {
    // Given
    const mockFilePath = 'teste';
    const invalidJsonContent = '{ "mock": "value" }'; // JSON válido, mas não é um array

    path.resolve.mockReturnValue(mockFilePath);
    fs.readFileSync.mockReturnValue(invalidJsonContent);

    // When & Then
    await expect(instalarPacotes({ isAsync: false })).rejects.toThrow(InvalidJsonFormat);
  });
});