import type { ICommand } from "../commands/ICommand";
import type { ICommandFactory } from "./ICommandFactory";


export class ConsumeCommandFactory implements ICommandFactory {
  buildCommand(): ICommand {
    throw new Error("Method not implemented.");
  }
}