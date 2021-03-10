import { DEFAULT_LOG_CONSOLE_ENABLE, DEFAULT_LOG_CONSOLE_LEVEL, DEFAULT_LOG_DIR, DEFAULT_LOG_FILE_DATE_PATTERN, DEFAULT_LOG_FILE_LEVEL, DEFAULT_LOG_FILE_MAX_FILES, DEFAULT_LOG_FILE_MAX_SIZE, DEFAULT_LOG_FILE_NAME_ERROR, DEFAULT_LOG_FILE_NAME_EXCEPTIONS, DEFAULT_LOG_FILE_NAME_INFO, DEFAULT_LOG_FILE_ZIP_ARCH, DEFAULT_LOG_LABEL, DEFAULT_LOG_SPLUNK_ENABLE, DEFAULT_LOG_SPLUNK_INDEX, DEFAULT_LOG_SPLUNK_LEVEL } from 'src/defaults';
import { isInteger } from 'utils/validation';
import { AppConfig } from '../appConfig.types';

export default (env: NodeJS.ProcessEnv) =>
  (appConfig: AppConfig = {} as AppConfig): AppConfig => ({
    ...appConfig,
    appLogger: {
      label: env.LOG_LABEL || DEFAULT_LOG_LABEL,
      dir: env.LOG_DIR || DEFAULT_LOG_DIR,
      fileLevel: env.LOG_FILE_LEVEL || DEFAULT_LOG_FILE_LEVEL,
      fileNameInfo: env.LOG_FILE_NAME_INFO || DEFAULT_LOG_FILE_NAME_INFO,
      fileNameError: env.LOG_FILE_NAME_ERROR || DEFAULT_LOG_FILE_NAME_ERROR,
      fileNameExceptions: env.LOG_FILE_NAME_EXCEPTIONS || DEFAULT_LOG_FILE_NAME_EXCEPTIONS,
      fileDatePattern: env.LOG_FILE_DATE_PATTERN || DEFAULT_LOG_FILE_DATE_PATTERN,
      fileZipArchive: !!env.LOG_FILE_ZIP_ARCH && isInteger(env.LOG_FILE_ZIP_ARCH) ? Number(env.LOG_FILE_ZIP_ARCH) === 1 : DEFAULT_LOG_FILE_ZIP_ARCH,
      fileMaxSize: !!env.LOG_FILE_MAX_SIZE && (isInteger(env.LOG_FILE_MAX_SIZE) && Number(env.LOG_FILE_MAX_SIZE) || env.LOG_FILE_MAX_SIZE) || DEFAULT_LOG_FILE_MAX_SIZE,
      fileMaxFiles: !!env.LOG_FILE_MAX_FILES && (isInteger(env.LOG_FILE_MAX_FILES) && Number(env.LOG_FILE_MAX_FILES) || env.LOG_FILE_MAX_FILES) || DEFAULT_LOG_FILE_MAX_FILES,
      consoleEnable: !!env.LOG_CONSOLE_ENABLE && isInteger(env.LOG_CONSOLE_ENABLE) ? Number(env.LOG_CONSOLE_ENABLE) === 1 : DEFAULT_LOG_CONSOLE_ENABLE,
      consoleLevel: env.LOG_CONSOLE_LEVEL || DEFAULT_LOG_CONSOLE_LEVEL,
      splunkEnable: !!env.LOG_SPLUNK_ENABLE && isInteger(env.LOG_SPLUNK_ENABLE) ? Number(env.LOG_SPLUNK_ENABLE) === 1 : DEFAULT_LOG_SPLUNK_ENABLE,
      splunkLevel: env.LOG_SPLUNK_LEVEL || DEFAULT_LOG_SPLUNK_LEVEL,
      splunkProtocol: env.LOG_SPLUNK_PROTOCOL || null,
      splunkHost: env.LOG_SPLUNK_HOST || null,
      splunkPort: !!env.LOG_SPLUNK_PORT && Number(env.LOG_SPLUNK_PORT) || null,
      splunkPath: env.LOG_SPLUNK_PATH || null,
      splunkToken: env.LOG_SPLUNK_TOKEN || null,
      splunkIndex: env.LOG_SPLUNK_INDEX || DEFAULT_LOG_SPLUNK_INDEX,
      splunkSource: env.LOG_SPLUNK_SOURCE || null,
      splunkSourceType: env.LOG_SPLUNK_SOURCE_TYPE || null
    }
  });
