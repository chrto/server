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
  consoleEnable: boolean;
  consoleLevel: string;

  splunkEnable: boolean;
  splunkLevel: string;
  splunkProtocol: string;
  splunkHost: string;
  splunkPort: number;
  splunkPath: string;
  splunkToken: string;
  splunkIndex: string;
  splunkSource: string;
  splunkSourceType: string;
}
