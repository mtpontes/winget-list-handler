export type ParsedArgs = {
  command: 'generate' | 'consume' | null;
  help: boolean;
  async: boolean;
  concurrency: number | null;
};