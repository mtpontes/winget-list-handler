import FileUtils from "../../application/utils/FileUtils";
import type IInstaller from "../installers/IInstaller";
import type IFormatter from "../formatters/IFormatter";
import type IProcessor from "../processors/IProcessor";
import InstallerImpl from "../installers/InstallerImpl";
import JsonFormatterImpl from "../formatters/JsonFormatterImpl";
import ProcessorImpl from "../processors/ProcessorImpl";
import type { ArgsType } from "../../domain/types/ArgsType";
import type { AppsType } from "../../domain/types/AppsType";
import type { FormattedPackagesType } from "../../domain/types/FormattedPackagesType";

export default class CLIService {
  constructor(
    private installer: IInstaller = new InstallerImpl(),
    private formatter: IFormatter = new JsonFormatterImpl(),
    private processor: IProcessor = new ProcessorImpl()
  ) { }

  public runGenerateFiles(): void {
    FileUtils.generateWingetListFile();
    FileUtils.createDumpFolder();
    const wingetListFileData: string = FileUtils.readWingetListFile();

    let { pcdApps, pcdBadApps } = this.processor.process(wingetListFileData);
    let fmtApps: Array<AppsType> = this.formatter.formatApps(pcdApps);
    let fmtBadApps: Array<string> = this.formatter.formatBadApps(pcdBadApps);

    const apps: FormattedPackagesType = { fmtApps, fmtBadApps };
    FileUtils.recordJsonReports(apps);
  }

  public async runConsumeAppsFile({ isAsync = false, concurrency = 5 }: ArgsType): Promise<void> {
    const packages: Array<AppsType> = FileUtils.getPackages();
    await this.installer.install(packages, { isAsync: isAsync, concurrency: concurrency });
  }
}
