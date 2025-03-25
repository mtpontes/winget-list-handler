import IFormatter from '../../../main/business/formatters/IFormatter';
import JsonFormatterImpl from '../../../main/business/formatters/JsonFormatterImpl';
import { AppsType } from '../../../main/infra/types/AppsType';

describe('JsonFormatterImpl', () => {
  let formatter: IFormatter;

  beforeEach(() => {
    formatter = new JsonFormatterImpl();
  });

  describe('formatApps', () => {
    it('should correctly format a valid list of apps with complete packages', () => {
      // Given
      const apps: Array<Array<string>> = [
        ['App1', '12345', '1.0.0'],
        ['App2', '67890']
      ];
      const expected: Array<AppsType> = [
        { name: 'App1', id: '12345', version: '1.0.0' },
        { name: 'App2', id: '67890', version: null }
      ];

      // When
      const result = formatter.formatApps(apps);

      // Then
      expect(result).toEqual(expected);
    });

    it('should ignore entries with empty or whitespace-only names', () => {
      // Given
      const apps: Array<Array<string>> = [
        [' ', '00000', '1.0.0'],
        ['', '11111'],
        ['App3', '22222']
      ];
      const expected: Array<AppsType> = [{ name: 'App3', id: '22222', version: null }];

      // When
      const result = formatter.formatApps(apps);

      // Then
      expect(result).toEqual(expected);
    });

    it('should return an empty array if all entries are invalid', () => {
      // Given
      const apps: Array<Array<string>> = [
        ['', '12345'],
        [' ', '67890']
      ];
      const expected: Array<AppsType> = [];

      // When
      const result = formatter.formatApps(apps);

      // Then
      expect(result).toEqual(expected);
    });

    it('should handle an empty list correctly', () => {
      // Given and When
      const result = formatter.formatApps([]);
      const expected: Array<AppsType> = [];

      // Then
      expect(result).toEqual(expected);
    });
  });

  describe('formatBadApps', () => {

    it('should correctly format a valid list of problematic apps', () => {
      // Given
      const apps: Array<Array<string>> = [
        ['App1'],
        ['App2']
      ];
      const expected: Array<string> = ['App1', 'App2'];

      // When
      const result: Array<string> = formatter.formatBadApps(apps);

      // Then
      expect(result).toEqual(expected);
    });

    it('should ignore empty or whitespace-only names', () => {
      // Given
      const apps: Array<Array<string>> = [
        ['App1'],
        [' '],
        [''],
        ['App2']
      ];
      const expected: Array<string> = ['App1', 'App2'];

      // When
      const result: Array<string> = formatter.formatBadApps(apps);

      // Then
      expect(result).toEqual(expected);
    });

    it('should return an empty array if all entries are invalid', () => {
      // Given
      const apps: Array<Array<string>> = [[' '], ['']];
      const expected: Array<string> = [];

      // When
      const result: Array<string> = formatter.formatBadApps(apps);

      // Then
      expect(result).toEqual(expected);
    });

    it('should handle an empty list correctly', () => {
      // Given
      const input: Array<Array<string>> = [];
      const expected: Array<string> = [];

      // When
      const result: Array<string> = formatter.formatBadApps(input);

      // Then
      expect(result).toEqual(expected);
    });
  });
});
