import { ProcessedPackagesType } from '../../infra/types/ProcessedPackagesType'

export default interface IProcessor {
  process(dados: string): ProcessedPackagesType;
}
