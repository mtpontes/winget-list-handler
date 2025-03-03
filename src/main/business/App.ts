import FileUtils from "../infra/utils/FileUtils";
import type IInstaller from "./installers/IInstaller";
import type IFormatter from "./formatters/IFormatter";
import type IProcessor from "./processors/IProcessor";
import InstallerImpl from "./installers/InstallerImpl";
import JsonFormatterImpl from "./formatters/JsonFormatterImpl";
import ProcessorImpl from "./processors/ProcessorImpl";
import type { ArgsType } from "../infra/types/ArgsType";
import type { AppsComPackageType } from "../infra/types/AppsComPackageType";
import { PacotesFormatadosType } from "../infra/types/PacotesFormatados";

export default class App {
  instalador: IInstaller;
  formatador: IFormatter;
  processador: IProcessor;

  constructor() {
    this.instalador = new InstallerImpl();
    this.formatador = new JsonFormatterImpl();
    this.processador = new ProcessorImpl();
  }

  public runGerarArquivos(): void {
    FileUtils.geraArquivoDoWinget();
    FileUtils.criarPastaDeDespejo();
    const wingetListFileData: string = FileUtils.readWingetListFile();

    let { appsComPackage, appsPrejudicados } = this.processador.process(wingetListFileData);
    let formatedAppsComPackage: Array<AppsComPackageType> = this.formatador.formatarAppsComPacote(appsComPackage);
    let formatedAppsPrejudicados: Array<string> = this.formatador.formatAppsSemPacote(appsPrejudicados);

    const apps: PacotesFormatadosType = {
      appsComPackage: formatedAppsComPackage,
      appsPrejudicados: formatedAppsPrejudicados,
    };
    FileUtils.gravarRelatoriosJson(apps);
  }

  public async runConsumirArquivo({ isAsync = false, concurrency = 5 }: ArgsType): Promise<void> {
    const packages: Array<AppsComPackageType> = FileUtils.getPackages();
    await this.instalador.install(packages, { isAsync: isAsync, concurrency: concurrency });
  }
}
