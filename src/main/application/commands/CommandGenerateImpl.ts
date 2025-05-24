import { ICommand } from './ICommand.js';
import FileUtils from "../utils/FileUtils.js";
import IProcessor from '../../business/processors/IProcessor.js';
import ProcessorImpl from '../../business/processors/ProcessorImpl.js';
import JsonFormatterImpl from '../../business/formatters/JsonFormatterImpl.js';
import IFormatter from "../../business/formatters/IFormatter.js";
import type { AppsType } from '../../domain/types/AppsType.js';
import type { FormattedPackagesType } from '../../domain/types/FormattedPackagesType.js';
import WingetUtils from '../utils/WingetUtils.js';


export class CommandGenerateImpl implements ICommand {
  constructor(
    private processor: IProcessor = new ProcessorImpl(),
    private formatter: IFormatter = new JsonFormatterImpl()
  ) { }

  execute(): void {
    FileUtils.createDumpFolder();
    const wingetListOutput: string = WingetUtils.executeWingetList();

    let { pkgApps: pcdApps, pkgBadApps: pcdBadApps } = this.processor.process(wingetListOutput);
    let fmtApps: Array<AppsType> = this.formatter.formatApps(pcdApps);
    let fmtBadApps: Array<string> = this.formatter.formatBadApps(pcdBadApps);

    const apps: FormattedPackagesType = { fmtApps, fmtBadApps };
    FileUtils.recordJsonReports(apps);
  }
}