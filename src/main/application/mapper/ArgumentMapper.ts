import ArgumentError from "../../business/errors/ArgumentError";
import type { InstallerOptions } from "../../domain/types/InstallerOptions";

export class ArgumentMapper {

  public parseOptionsConsumeFile(parseable: any): InstallerOptions {
    const asyncJobs = parseable.asyncJobs ? Number(parseable.asyncJobs) : undefined
    if (typeof asyncJobs === 'number' && !isNaN(asyncJobs) && (asyncJobs < 1 || asyncJobs > 100)) {
      throw new ArgumentError('The number of jobs should be greater than zero.')
    }

    return { async: parseable.async, asyncJobs: asyncJobs }
  }
}