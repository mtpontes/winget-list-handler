import IFormatter from '../../../main/business/formatters/IFormatter';
import JsonFormatterImpl from '../../../main/business/formatters/JsonFormatterImpl';
import type { AppsComPackageType } from '../../../main/infra/types/AppsComPackageType';

describe('JsonFormatterImpl', () => {
  let formatador: IFormatter;

  beforeEach(() => {
    formatador = new JsonFormatterImpl();
  });

  describe('formatarAppsComPackage', () => {
    it('deve formatar corretamente uma lista válida de aplicativos com pacotes completos', () => {
      // Given
      const apps: Array<Array<string>> = [
        ['App1', '12345', '1.0.0'],
        ['App2', '67890']
      ];
      const expected: Array<AppsComPackageType> = [
        { nome: 'App1', id: '12345', version: '1.0.0' },
        { nome: 'App2', id: '67890', version: null }
      ]

      // When
      const resultado = formatador.formatarAppsComPacote(apps);

      // Then
      expect(resultado).toEqual(expected);
    });

    it('deve ignorar entradas com nomes vazios ou em branco', () => {
      // Given
      const apps: Array<Array<string>> = [
        [' ', '00000', '1.0.0'],
        ['', '11111'],
        ['App3', '22222']
      ];
      const expected: Array<AppsComPackageType> = [{ nome: 'App3', id: '22222', version: null }]

      // When
      const resultado = formatador.formatarAppsComPacote(apps);

      // Then
      expect(resultado).toEqual(expected);
    });

    it('deve ignorar entradas com nomes vazios ou em branco', () => {
      // Given
      const apps: Array<Array<string>> = [
        [' ', '00000', '1.0.0'],
        ['', '11111'],
        ['App3', '22222']
      ];
      const expected: Array<AppsComPackageType> = [{ nome: 'App3', id: '22222', version: null }]

      // When
      const resultado = formatador.formatarAppsComPacote(apps);

      // Then
      expect(resultado).toEqual(expected);
    });

    it('deve retornar um array vazio se todas as entradas forem inválidas', () => {
      // Given
      const apps: Array<Array<string>> = [
        ['', '12345'],
        [' ', '67890']
      ];
      const expected: Array<AppsComPackageType> = []

      // When
      const resultado = formatador.formatarAppsComPacote(apps);

      // Then
      expect(resultado).toEqual(expected);
    });

    it('deve lidar corretamente com uma lista vazia', () => {
      // Given and When
      const resultado = formatador.formatarAppsComPacote([]);
      const expected: Array<AppsComPackageType> = []

      // Then
      expect(resultado).toEqual(expected);
    });
  });

  describe('formatarAppsPrejudicados', () => {

    it('deve formatar corretamente uma lista válida de aplicativos prejudicados', () => {
      // Given
      const apps: Array<Array<string>> = [
        ['App1'],
        ['App2']
      ];
      const expected: Array<string> = ['App1', 'App2']

      // When
      const resultado: Array<string> = formatador.formatAppsSemPacote(apps);

      // Then
      expect(resultado).toEqual(expected);
    });

    it('deve ignorar nomes vazios ou em branco', () => {
      // Given
      const apps: Array<Array<string>> = [
        ['App1'],
        [' '],
        [''],
        ['App2']
      ];
      const expected: Array<string> = ['App1', 'App2']

      // When
      const resultado: Array<string> = formatador.formatAppsSemPacote(apps);

      // Then
      expect(resultado).toEqual(expected);
    });

    it('deve retornar um array vazio se todas as entradas forem inválidas', () => {
      // Given
      const apps: Array<Array<string>> = [[' '], ['']];
      const expected: Array<string> = []

      // When
      const resultado: Array<string> = formatador.formatAppsSemPacote(apps);

      // Then
      expect(resultado).toEqual(expected);
    });

    it('deve lidar corretamente com uma lista vazia', () => {
      // Given
      const entrada: Array<Array<string>> = []
      const expected: Array<string> = []

      // When
      const resultado: Array<string> = formatador.formatAppsSemPacote(entrada);

      // Then
      expect(resultado).toEqual(expected);
    });
  });
});