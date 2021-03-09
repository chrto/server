export interface ILoggerConfig {
  label: string;
  dir: string;
  fileLevel: string;
  fileNameInfo: string;
  fileNameError: string;
  fileNameExceptions: string;
  fileDatePattern: string;
  fileZipArchive: boolean;
  fileMaxSize: string | number;
  fileMaxFiles: string | number;
  consoleLevel: string;
  consoleEnable: boolean;
}
