import path from "node:path";
import { TipoProcessamento } from "../enum/TipoProcessamento";
import FileExtensionConst from "./FileExtensionConst";

export default class Constants {
  public static UTF_8: BufferEncoding = "utf8";
  public static ARQUIVO_BAT = "exec.bat";
  public static ID = "ID";
  public static ZERO = 0;

  public static FOLDER_RESULT_NAME = "arquivos_gerados";
  public static FOLDER_RESULT_PATH = path.resolve(Constants.FOLDER_RESULT_NAME);
  public static APPS_FILE_PATH = path.join(
    Constants.FOLDER_RESULT_PATH,
    `${TipoProcessamento.COM_PACKAGE + FileExtensionConst.JSON}`
  )
  public static WINGET_LIST_TXT_FILE_NAME = "winget_list.txt";
  public static WINGET_LIST_TXT_FILE_PATH = path.resolve(Constants.WINGET_LIST_TXT_FILE_NAME)

  public static WINGET_LIST_COMMAND = `winget list > ${this.WINGET_LIST_TXT_FILE_NAME}`;
}