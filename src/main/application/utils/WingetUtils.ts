import { exec } from 'shelljs';

export default class WingetUtils {
  public static executeWingetList(): string {
    return exec('winget list', { silent: true }).stdout;
  }
}