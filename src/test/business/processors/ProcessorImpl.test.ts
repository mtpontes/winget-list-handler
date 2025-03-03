import Constants from '../../../main/domain/constants/Constants';
import BadPackagesConst from '../../../main/domain/constants/BadPackagesConst'
import ProcessorImpl from '../../../main/business/processors/ProcessorImpl';

describe('ProcessorImpl', () => {
  let processor: ProcessorImpl;

  beforeEach(() => {
    processor = new ProcessorImpl();
  });

  describe('estruturarDadosDeLeitura', () => {
    it('deve estruturar os dados corretamente', () => {
      const data = `Cabeçalho\n${Constants.ID}\nSeparador\nApp1  ID1  v1.0\nApp2  ID2  v2.0`;
      const expected = [['App1', 'ID1', 'v1.0'], ['App2', 'ID2', 'v2.0']];
      const result = processor['estruturarDadosDeLeitura'](data);
      expect(result).toEqual(expected);
    });
  });

  describe('removerColunasIrrelevantes', () => {
    it('deve remover colunas irrelevantes', () => {
      const data = [['App1', 'ID1', 'v1.0', 'Extra1'], ['App2', 'ID2', 'v2.0', 'Extra2']];
      const expected = [['App1', 'ID1', 'v1.0'], ['App2', 'ID2', 'v2.0']];
      const result = processor['removerColunasIrrelevantes'](data);
      expect(result).toEqual(expected);
    });
  });

  describe('segregarTiposDeApps', () => {
    it('deve segregar apps com pacotes completos e prejudicados', () => {
      const data = [
        ['App1', 'ID1', 'v1.0'],
        ['App2', 'ID2', BadPackagesConst.AUSENCIA_DE_PACOTE],
        ['App3', 'ID3', BadPackagesConst.PREJUIZO_DE_PACOTE],
        ['App4', 'ID4', 'v4.0']
      ];
      const expected = {
        appsComPackage: [['App1', 'ID1', 'v1.0'], ['App4', 'ID4', 'v4.0']],
        appsPrejudicados: [['App2', 'ID2', BadPackagesConst.AUSENCIA_DE_PACOTE], ['App3', 'ID3', BadPackagesConst.PREJUIZO_DE_PACOTE]]
      };
      const result = processor['segregarTiposDeApps'](data);
      expect(result).toEqual(expected);
    });
  });

  describe('process', () => {
    it('deve processar os dados corretamente', () => {
      const data = `Cabeçalho\n${Constants.ID}\nSeparador\nApp1  ID1  v1.0  Extra1\nApp2  ID2  ${BadPackagesConst.AUSENCIA_DE_PACOTE}  Extra2`;
      const expected = {
        appsComPackage: [['App1', 'ID1', 'v1.0']],
        appsPrejudicados: [['App2', 'ID2', BadPackagesConst.AUSENCIA_DE_PACOTE]]
      };
      const result = processor.process(data);
      expect(result).toEqual(expected);
    });
  });
});