import InstallerImpl from '../../../main/business/installers/InstallerImpl';
import shelljs from 'shelljs';
import { ArgsType } from '../../../main/infra/types/ArgsType';
import { AppsComPackageType } from '../../../main/infra/types/AppsComPackageType';
import Constants from '../../../main/domain/constants/Constants';

jest.mock('shelljs', () => ({
  exec: jest.fn(),
}));

jest.mock('async-await-queue', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    run: jest.fn().mockImplementation((task) => task()),
  })),
}));

describe('InstallerImpl', () => {
  let installer: InstallerImpl;
  const mockPackages: AppsComPackageType[] = [
    { id: 'package1', nome: 'Package 1', version: '' },
    { id: 'package2', nome: 'Package 2', version: '' },
  ];
  const mockArgs: ArgsType = {
    isAsync: false,
    concurrency: 2,
  };

  beforeEach(() => {
    installer = new InstallerImpl();
    jest.clearAllMocks();
  });

  describe('instalacaoSync', () => {
    it('deve executar os comandos de instalação de forma síncrona', () => {
      // Given
      const expectedCommand1 = `${Constants.ARQUIVO_BAT} package1`;
      const expectedCommand2 = `${Constants.ARQUIVO_BAT} package2`;

      // When
      installer['instalacaoSync'](mockPackages);

      // Then
      expect(shelljs.exec).toHaveBeenCalledTimes(2);
      expect(shelljs.exec).toHaveBeenCalledWith(expectedCommand1, { silent: false });
      expect(shelljs.exec).toHaveBeenCalledWith(expectedCommand2, { silent: false });
    });
  });

  describe('instalacaoAsync', () => {
    it('deve executar os comandos de instalação de forma assíncrona com controle de concorrência', async () => {
      // Given
      const expectedCommand1 = `${Constants.ARQUIVO_BAT} package1`;
      const expectedCommand2 = `${Constants.ARQUIVO_BAT} package2`;
      const mockConcurrency = 2;

      // Mock do shelljs.exec para retornar uma Promise resolvida
      (shelljs.exec as jest.Mock).mockImplementation((command, options, callback) => {
        if (options.async && callback) {
          callback(0); // Simula sucesso (código de saída 0)
        }
        return { code: 0 }; // Retorno padrão para exec síncrono
      });

      // When
      await installer['instalacaoAsync'](mockPackages, mockConcurrency);

      // Then
      expect(shelljs.exec).toHaveBeenCalledTimes(2);
      expect(shelljs.exec).toHaveBeenCalledWith(expectedCommand1, { silent: false, async: true }, expect.any(Function));
      expect(shelljs.exec).toHaveBeenCalledWith(expectedCommand2, { silent: false, async: true }, expect.any(Function));
    }, 10000); // Aumenta o timeout para 10 segundos
  });

  describe('install', () => {
    it('deve chamar instalacaoSync quando isAsync for false', () => {
      // Given
      const mockArgsSync: ArgsType = { ...mockArgs, isAsync: false };
      const instalacaoSyncSpy = jest.spyOn(installer as any, 'instalacaoSync');

      // When
      installer.install(mockPackages, mockArgsSync);

      // Then
      expect(instalacaoSyncSpy).toHaveBeenCalledWith(mockPackages);
    });

    it('deve chamar instalacaoAsync quando isAsync for true', async () => {
      // Given
      const mockArgsAsync: ArgsType = { ...mockArgs, isAsync: true };
      const instalacaoAsyncSpy = jest.spyOn(installer as any, 'instalacaoAsync');

      // When
      await installer.install(mockPackages, mockArgsAsync);

      // Then
      expect(instalacaoAsyncSpy).toHaveBeenCalledWith(mockPackages, mockArgsAsync.concurrency);
    });
  });
});