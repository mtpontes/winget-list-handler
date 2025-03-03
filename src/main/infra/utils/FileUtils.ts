import path from "node:path";
import { exec } from "shelljs";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import Constants from "../../domain/constants/Constants";
import FileExtensionConst from "../../domain/constants/FileExtensionConst";
import { TipoProcessamento } from "../../domain/enum/TipoProcessamento";
import type { AppsComPackageType } from "../types/AppsComPackageType";
import FileNotReadableError from "../error/errors/FileNotReadableError";
import InvalidJsonFormat from "../error/errors/InvalidJsonFormat";
import type { PacotesFormatadosType } from "../types/PacotesFormatados";

/**
 * Classe de utilidade para lidar com operações de arquivo relacionadas ao manipulador da lista do Winget.
 */
export default class FileUtils {
  /**
   * Cria o diretório para despejar arquivos de saída se ainda não existir.
   */
  public static criarPastaDeDespejo(): void {
    const path = Constants.FOLDER_RESULT_PATH;
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
  }

  /**
   * Gera um arquivo que contém a lista de aplicativos instalados usando o Winget.
   * A saída é salva no caminho do arquivo base definido nas constantes.
   */
  public static geraArquivoDoWinget(): void {
    exec(Constants.WINGET_LIST_COMMAND);
  }

  /**
   * Lê o arquivo de saída Winget e retorna seu conteúdo como uma string.
   *
   * @returns {string} O conteúdo do arquivo de saída Winget.
   */
  public static readWingetListFile(): string {
    return readFileSync(Constants.WINGET_LIST_TXT_FILE_PATH, Constants.UTF_8);
  }

  static writeFails(fails: Array<AppsComPackageType>) {
    const failsAsText = JSON.stringify(fails, null, 2);
    writeFileSync(this.criaOutputPathJson(TipoProcessamento.FAIL), failsAsText);
  }

  /**
   * Salva os dados do aplicativo processado nos arquivos de relatório JSON.
   *
   * @param {Array<AppsComPackageType>} appsComPackage - Lista de aplicativos com pacotes Winget.
   * @param {Array<string>} appsPrejudicados - Lista de aplicativos sem pacotes Winget ou com problemas.
   */
  public static gravarRelatoriosJson(apps: PacotesFormatadosType): void {
    const appsComPacoteString: string = JSON.stringify(apps.appsComPackage, null, 2);
    const appsPrejudicadosString: string = JSON.stringify(apps.appsPrejudicados, null, 2);

    writeFileSync(this.criaOutputPathJson(TipoProcessamento.COM_PACKAGE), appsComPacoteString);
    writeFileSync(this.criaOutputPathJson(TipoProcessamento.PREJUDICADO), appsPrejudicadosString);
  }

  private static criaOutputPathJson(tipoProcessamento: TipoProcessamento): string {
    return path.join(Constants.FOLDER_RESULT_PATH, `${tipoProcessamento + FileExtensionConst.JSON}`)
  }

  /**
   * Lê e retorna a lista de pacotes a partir de um arquivo JSON.
   * @returns {Array<AppsComPackageType>} Lista de pacotes.
   * @throws {FileNotReadableError} Se o arquivo não puder ser lido.
   * @throws {InvalidJsonFormat} Se o conteúdo do arquivo não for um JSON válido ou não for um array.
   */
  public static getPackages(): Array<AppsComPackageType> {
    let filePath: string = Constants.APPS_FILE_PATH;
    try {
      const packagesAsText: string = readFileSync(filePath, { encoding: Constants.UTF_8 });
      const packages: Array<AppsComPackageType> = JSON.parse(packagesAsText);
      if (!Array.isArray(packages)) {
        throw new InvalidJsonFormat();
      }

      return packages;

    } catch (error) {
      if (error instanceof InvalidJsonFormat) throw error;
      throw new FileNotReadableError(filePath);
    }
  }
}
