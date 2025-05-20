import { ProcessedPackagesType } from '../../domain/types/ProcessedPackagesType'

export default interface IProcessor {
  process(dados: string): ProcessedPackagesType;
}
