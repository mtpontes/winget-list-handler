import path from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import Constants from '../../../main/domain/constants/Constants';
import FileExtensionConst from '../../../main/domain/constants/FileExtensionConst';
import { TypeProcess } from '../../../main/domain/enum/TypeProcess';
import type { AppsType } from '../../../main/infra/types/AppsType';
import FileUtils from '../../../main/infra/utils/FileUtils';
import InvalidJsonFormat from '../../../main/infra/error/errors/InvalidJsonFormat';
import FileNotReadableError from '../../../main/infra/error/errors/FileNotReadableError';
import type { FormattedPackagesType } from '../../../main/infra/types/FormattedPackagesType';

const TEST_DIRECTORY = './src/test/infra/utils/';

describe('FileUtils', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe('recordJsonReports', () => {
    const folderName = 'generate-file-test';
    const folderPathTests = path.join(__dirname, folderName);

    beforeEach(() => {
      if (!existsSync(folderPathTests)) mkdirSync(folderPathTests, { recursive: true });
      Constants.FOLDER_RESULT_PATH = TEST_DIRECTORY + folderName;
    });

    afterEach(() => {
      rmSync(folderPathTests, { recursive: true, force: true });
    });

    it('should correctly record the JSON reports', () => {
      // Given
      const input: FormattedPackagesType = {
        fmtApps: [{ name: 'App1', id: '1234', version: '1.0' }],
        fmtBadApps: ['app1', 'app2']
      };

      const expectedWithPackage: string = JSON.stringify(input.fmtApps, null, 2);
      const expectedWithoutPackage: string = JSON.stringify(input.fmtBadApps, null, 2);

      // When
      FileUtils.recordJsonReports(input);
      const pathWithPackage: string = path.join(folderPathTests, `${TypeProcess.APPS}${FileExtensionConst.JSON}`);
      const pathDamaged: string = path.join(folderPathTests, `${TypeProcess.BAD_APPS}${FileExtensionConst.JSON}`);
      const contentWithPackage: string = readFileSync(pathWithPackage, 'utf8');
      const contentDamaged: string = readFileSync(pathDamaged, 'utf8');

      // Then
      expect(contentWithPackage).toEqual(expectedWithPackage);
      expect(contentDamaged).toEqual(expectedWithoutPackage);
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

    it('should return the list of packages correctly when the JSON file is valid', () => {
      // Given
      Constants.APPS_FILE_PATH = path.join(folderPathTests, `${TypeProcess.APPS}${FileExtensionConst.JSON}`);
      const expectedPackages: Array<AppsType> = [
        { name: 'App1', id: '1234', version: '1.0' },
        { name: 'App2', id: '5678', version: '2.0' },
      ];
      const filePath = path.join(folderPathTests, `${TypeProcess.APPS}${FileExtensionConst.JSON}`);
      writeFileSync(filePath, JSON.stringify(expectedPackages, null, 2));

      // When
      const packages = FileUtils.getPackages();

      // Then
      expect(packages).toEqual(expectedPackages);
    });

    it('should throw InvalidJsonFormat when the file content is not an array', () => {
      // Given
      const invalidJsonContent = { name: 'App1', id: '1234', version: '1.0' };
      const filePath = path.join(folderPathTests, `${TypeProcess.APPS}${FileExtensionConst.JSON}`);
      writeFileSync(filePath, JSON.stringify(invalidJsonContent, null, 2));

      // When / Then
      expect(() => FileUtils.getPackages()).toThrow(InvalidJsonFormat);
    });

    it('should throw FileNotReadableError when the file cannot be read', () => {
      // Given
      const nonExistentFilePath = path.join(folderPathTests, 'non-existent-file.json');

      // When / Then
      expect(() => FileUtils.getPackages()).toThrow(FileNotReadableError);
    });
  });
});
