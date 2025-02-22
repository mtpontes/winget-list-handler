const ProcessadorDeDados = require('../../main/services/ProcessadorDeDados');
const { IdentificadorPadraoTextual } = require('../../main/constants/constants');

describe('ProcessadorDeDados', () => {
  let processador;

  beforeEach(() => {
    processador = new ProcessadorDeDados();
  });

  it('deve retornar arrays vazios quando a entrada está vazia', () => {
    // Given
    const resultado = processador.processar('');

    // When and Then
    expect(resultado).toEqual({
      appsComPackage: [],
      appsPrejudicados: [],
    });
  });

  it('deve processar apenas aplicativos com pacotes completos', () => {
    // Given
    const entrada = `
Nome      ID      Versão
-----------------------
App1      123     1.0.0
App2      456     2.3.1`;

    // When
    const { appsComPackage, appsPrejudicados } = processador.processar(entrada);
    console.log('===== com pacote', appsComPackage)
    console.log('===== sem pacote', appsPrejudicados)

    // Then
    expect(appsComPackage).toEqual([
      ['App1', '123', '1.0.0'],
      ['App2', '456', '2.3.1'],
    ]);

    expect(appsPrejudicados).toEqual([])
  });

  it('deve processar apenas aplicativos prejudicados', () => {
    // Given
    const entrada = `
Nome      ID      Versão
-----------------------
AppErro   789     ${IdentificadorPadraoTextual.AUSENCIA_DE_PACOTE}`;

    // When
    const { appsComPackage, appsPrejudicados } = processador.processar(entrada);

    // Then
    expect(appsComPackage).toHaveLength(0);

    expect(appsPrejudicados).toEqual([
      ['AppErro', '789', IdentificadorPadraoTextual.AUSENCIA_DE_PACOTE],
    ]);
  });

  it('deve separar corretamente aplicativos completos e prejudicados', () => {
    // Given
    const entrada = `
Nome      ID      Versão
-----------------------
App1      123     1.0.0
App2      456     ${IdentificadorPadraoTextual.PREJUIZO_DE_PACOTE}
App3      789     2.3.4`;

    // When
    const resultado = processador.processar(entrada);

    // Then
    expect(resultado.appsComPackage).toEqual([
      ['App1', '123', '1.0.0'],
      ['App3', '789', '2.3.4'],
    ]);

    expect(resultado.appsPrejudicados).toEqual([
      ['App2', '456', IdentificadorPadraoTextual.PREJUIZO_DE_PACOTE],
    ]);
  });

  it('deve ignorar cabeçalhos e linhas irrelevantes', () => {
    // Given
    const entrada = `
Alguma Informação Irrelevante

Nome      ID      Versão
-----------------------
App1      123     1.0.0
App2      456     ${IdentificadorPadraoTextual.PREJUIZO_DE_PACOTE}`;

    // When
    const resultado = processador.processar(entrada);

    // Then
    expect(resultado.appsComPackage).toEqual([
      ['App1', '123', '1.0.0'],
    ]);

    expect(resultado.appsPrejudicados).toEqual([
      ['App2', '456', IdentificadorPadraoTextual.PREJUIZO_DE_PACOTE],
    ]);
  });
});
