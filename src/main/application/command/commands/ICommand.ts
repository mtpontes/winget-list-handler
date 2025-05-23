import type { ParsedArgs } from "../../../domain/types/ParsedArgs";

export interface ICommand {
  execute(args: ParsedArgs): void;
}