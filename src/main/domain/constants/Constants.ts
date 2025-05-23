import path from "node:path";
import { TypeProcess } from "../enum/TypeProcess";
import FileExtensionConst from "./FileExtensionConst";

export default class Constants {
  public static UTF_8: BufferEncoding = "utf8";
  public static FILE_BAT = "exec.bat";
  public static ID = "ID";
  public static ZERO = 0;

  public static FOLDER_RESULT_NAME = "generatedFiles";
  public static FOLDER_RESULT_PATH = path.resolve(Constants.FOLDER_RESULT_NAME);
  public static APPS_FILE_PATH = path.join(
    Constants.FOLDER_RESULT_PATH,
    `${TypeProcess.APPS + FileExtensionConst.JSON}`
  )
  public static WINGET_LIST_TXT_FILE_NAME = "winget_list.txt";
  public static WINGET_LIST_TXT_FILE_PATH = path.resolve(Constants.WINGET_LIST_TXT_FILE_NAME)

  public static WINGET_LIST_COMMAND = `winget list > ${Constants.WINGET_LIST_TXT_FILE_NAME}`;
}