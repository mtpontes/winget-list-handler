export type ParsedArgs = {
  command: 'generate' | 'consume' | undefined;
  options: Record<string, unknown>;
  help: boolean;
};