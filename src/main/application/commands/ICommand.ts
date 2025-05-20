import type CLIService from "../../business/service/CLIService";

export interface ICommand {
  run(app: CLIService): void;
}