import type { ICommand } from "../commands/ICommand";


export interface ICommandFactory {
  buildCommand(): ICommand
}