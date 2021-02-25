export interface ILoggerConfig {
  label: string;
  dir: string;
  fileLevel: string;
  fileNameInfo: string;
  fileNameError: string;
  fileDatePattern: string;
  fileZipArchive: boolean;
  fileMaxSize: string | number;
  fileMaxFiles: string | number;
  consoleLevel: string;
  consoleEnable: boolean;
}
