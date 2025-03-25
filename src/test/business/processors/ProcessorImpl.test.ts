import Constants from '../../../main/domain/constants/Constants';
import BadPackagesConst from '../../../main/domain/constants/BadPackagesConst'
import ProcessorImpl from '../../../main/business/processors/ProcessorImpl';

describe('ProcessorImpl', () => {
  let processor: ProcessorImpl;

  beforeEach(() => {
    processor = new ProcessorImpl();
  });

  describe('structureReadingData', () => {
    it('should structure the data correctly', () => {
      const data = `Header\n${Constants.ID}\nSeparator\nApp1  ID1  v1.0\nApp2  ID2  v2.0`;
      const expected = [['App1', 'ID1', 'v1.0'], ['App2', 'ID2', 'v2.0']];
      const result = processor['structureReadingData'](data);
      expect(result).toEqual(expected);
    });
  });

  describe('segregateAppTypes', () => {
    it('should segregate apps with complete and broken packages', () => {
      const data = [
        ['App1', 'ID1', 'v1.0'],
        ['App2', 'ID2', BadPackagesConst.MISSING_PACKAGE],
        ['App3', 'ID3', BadPackagesConst.BROKEN_PACKAGE],
        ['App4', 'ID4', 'v4.0']
      ];
      const expected = {
        pcdApps: [['App1', 'ID1', 'v1.0'], ['App4', 'ID4', 'v4.0']],
        pcdBadApps: [['App2', 'ID2', BadPackagesConst.MISSING_PACKAGE], ['App3', 'ID3', BadPackagesConst.BROKEN_PACKAGE]]
      };
      const result = processor['segregateAppTypes'](data);
      expect(result).toEqual(expected);
    });
  });

  describe('process', () => {
    it('should process the data correctly', () => {
      const data = `Header\n${Constants.ID}\nSeparator\nApp1  ID1  v1.0  Extra1\nApp2  ID2  ${BadPackagesConst.MISSING_PACKAGE}  Extra2`;
      const expected = {
        pcdApps: [['App1', 'ID1', 'v1.0']],
        pcdBadApps: [['App2', 'ID2', BadPackagesConst.MISSING_PACKAGE]]
      };
      const result = processor.process(data);
      expect(result).toEqual(expected);
    });
  });
});
