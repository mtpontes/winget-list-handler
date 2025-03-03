export default interface IProcessor {
  process(dados: string): {
    appsComPackage: Array<Array<string>>;
    appsPrejudicados: Array<Array<string>>;
  };
}
