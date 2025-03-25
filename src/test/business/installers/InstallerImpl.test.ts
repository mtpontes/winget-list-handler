import InstallerImpl from '../../../main/business/installers/InstallerImpl';
import shelljs from 'shelljs';
import Constants from '../../../main/domain/constants/Constants';
import { ArgsType } from '../../../main/infra/types/ArgsType';
import { AppsType } from '../../../main/infra/types/AppsType';

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
  const mockPackages: AppsType[] = [
    { id: 'package1', name: 'Package 1', version: '' },
    { id: 'package2', name: 'Package 2', version: '' },
  ];
  const mockArgs: ArgsType = {
    isAsync: false,
    concurrency: 2,
  };

  beforeEach(() => {
    installer = new InstallerImpl();
    jest.clearAllMocks();
  });

  describe('installationSync', () => {
    it('should execute installation commands synchronously', () => {
      // Given
      const expectedCommand1 = `${Constants.FILE_BAT} package1`;
      const expectedCommand2 = `${Constants.FILE_BAT} package2`;

      // When
      installer['installationSync'](mockPackages);

      // Then
      expect(shelljs.exec).toHaveBeenCalledTimes(2);
      expect(shelljs.exec).toHaveBeenCalledWith(expectedCommand1, { silent: false });
      expect(shelljs.exec).toHaveBeenCalledWith(expectedCommand2, { silent: false });
    });
  });

  describe('installationAsync', () => {
    it('should execute installation commands asynchronously with concurrency control', async () => {
      // Given
      const expectedCommand1 = `${Constants.FILE_BAT} ${mockPackages[0].name}`;
      const expectedCommand2 = `${Constants.FILE_BAT} ${mockPackages[1].name}`;
      const mockConcurrency = 2;

      // Mock shelljs.exec to return a resolved Promise
      (shelljs.exec as jest.Mock).mockImplementation((command, options, callback) => {
        if (options.async && callback) {
          callback(0); // Simulate success (exit code 0)
        }
        return { code: 0 }; // Default return for synchronous exec
      });

      // When
      await installer['installationAsync'](mockPackages, mockConcurrency);

      // Then
      expect(shelljs.exec).toHaveBeenCalledTimes(2);
      expect(shelljs.exec).toHaveBeenCalledWith(expectedCommand1, { silent: false, async: true }, expect.any(Function));
      expect(shelljs.exec).toHaveBeenCalledWith(expectedCommand2, { silent: false, async: true }, expect.any(Function));
    }, 10000); // Increase the timeout to 10 seconds
  });

  describe('install', () => {
    it('should call installationSync when isAsync is false', () => {
      // Given
      const mockArgsSync: ArgsType = { ...mockArgs, isAsync: false };
      const installationSyncSpy = jest.spyOn(installer as any, 'installationSync');

      // When
      installer.install(mockPackages, mockArgsSync);

      // Then
      expect(installationSyncSpy).toHaveBeenCalledWith(mockPackages);
    });

    it('should call installationAsync when isAsync is true', async () => {
      // Given
      const mockArgsAsync: ArgsType = { ...mockArgs, isAsync: true };
      const installationAsyncSpy = jest.spyOn(installer as any, 'installationAsync');

      // When
      await installer.install(mockPackages, mockArgsAsync);

      // Then
      expect(installationAsyncSpy).toHaveBeenCalledWith(mockPackages, mockArgsAsync.concurrency);
    });
  });
});
