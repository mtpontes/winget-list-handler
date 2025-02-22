const FormatadorJson = require('../../main/services/FormatadorJson')

describe('FormatadorJson', () => {
  let formatador;

  beforeEach(() => {
    formatador = new FormatadorJson();
  });

  describe('formatarAppsComPackage', () => {
    it('deve formatar corretamente uma lista válida de aplicativos com pacotes completos', () => {
      // Given
      const apps = [
        ['App1', '12345', '1.0.0'],
        ['App2', '67890']
      ];

      // When
      const resultado = formatador.formatarAppsComPackage(apps);

      // Then
      expect(resultado).toBe(JSON.stringify([
        { nome: 'App1', id: '12345', version: '1.0.0' },
        { nome: 'App2', id: '67890', version: null }
      ], null, 2));
    });

    it('deve ignorar entradas com nomes vazios ou em branco', () => {
      // Given
      const apps = [
        [' ', '00000', '1.0.0'],
        ['', '11111'],
        ['App3', '22222']
      ];

      // When
      const resultado = formatador.formatarAppsComPackage(apps);

      // Then
      expect(resultado).toBe(JSON.stringify([
        { nome: 'App3', id: '22222', version: null }
      ], null, 2));
    });

    it('deve retornar um array vazio se todas as entradas forem inválidas', () => {
      // Given
      const apps = [
        ['', '12345'],
        [' ', '67890']
      ];

      // When
      const resultado = formatador.formatarAppsComPackage(apps);

      // Then
      expect(resultado).toBe(JSON.stringify([], null, 2));
    });

    it('deve lidar corretamente com uma lista vazia', () => {
      // Given and When
      const resultado = formatador.formatarAppsComPackage([]);

      // Then
      expect(resultado).toBe(JSON.stringify([], null, 2));
    });
  });

  describe('formatarAppsPrejudicados', () => {
    it('deve formatar corretamente uma lista válida de aplicativos prejudicados', () => {
      // Given
      const apps = [
        ['App1'],
        ['App2']
      ];

      // When
      const resultado = formatador.formatarAppsPrejudicados(apps);

      // Then
      expect(resultado).toBe(JSON.stringify(['App1', 'App2'], null, 2));
    });

    it('deve ignorar nomes vazios ou em branco', () => {
      // Given
      const apps = [
        ['App1'],
        [' '],
        [''],
        ['App2']
      ];

      // When
      const resultado = formatador.formatarAppsPrejudicados(apps);

      // Then
      expect(resultado).toBe(JSON.stringify(['App1', 'App2'], null, 2));
    });

    it('deve retornar um array vazio se todas as entradas forem inválidas', () => {
      // Given
      const apps = [
        [' '],
        ['']
      ];

      // When
      const resultado = formatador.formatarAppsPrejudicados(apps);

      // Then
      expect(resultado).toBe(JSON.stringify([], null, 2));
    });

    it('deve lidar corretamente com uma lista vazia', () => {
      // Given and When
      const resultado = formatador.formatarAppsPrejudicados([]);

      // Then
      expect(resultado).toBe(JSON.stringify([], null, 2));
    });
  });
});
