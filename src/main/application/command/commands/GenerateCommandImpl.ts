import { ICommand } from './ICommand.js';
import FileUtils from "../../utils/FileUtils";
import IProcessor from '../../../business/processors/IProcessor.js';
import ProcessorImpl from '../../../business/processors/ProcessorImpl.js';
import JsonFormatterImpl from '../../../business/formatters/JsonFormatterImpl.js';
import IFormatter from "../../../business/formatters/IFormatter";
import type { AppsType } from '../../../domain/types/AppsType.js';
import type { FormattedPackagesType } from '../../../domain/types/FormattedPackagesType.js';
import type { ParsedArgs } from '../../../domain/types/ParsedArgs.js';


export class GenerateCommandImpl implements ICommand {
  constructor(
    private formatter: IFormatter = new JsonFormatterImpl(),
    private processor: IProcessor = new ProcessorImpl()
  ) { }

  execute(args: ParsedArgs): void {
    FileUtils.generateWingetListFile();
    FileUtils.createDumpFolder();
    const wingetListFileData: string = FileUtils.readWingetListFile();

    let { pcdApps, pcdBadApps } = this.processor.process(wingetListFileData);
    let fmtApps: Array<AppsType> = this.formatter.formatApps(pcdApps);
    let fmtBadApps: Array<string> = this.formatter.formatBadApps(pcdBadApps);

    const apps: FormattedPackagesType = { fmtApps, fmtBadApps };
    FileUtils.recordJsonReports(apps);
  }
}