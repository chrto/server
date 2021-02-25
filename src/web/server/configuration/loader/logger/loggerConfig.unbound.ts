import { DEFAULT_LOG_CONSOLE_ENABLE, DEFAULT_LOG_CONSOLE_LEVEL, DEFAULT_LOG_DIR, DEFAULT_LOG_FILE_DATE_PATTERN, DEFAULT_LOG_FILE_LEVEL, DEFAULT_LOG_FILE_MAX_FILES, DEFAULT_LOG_FILE_MAX_SIZE, DEFAULT_LOG_FILE_NAME_ERROR, DEFAULT_LOG_FILE_NAME_INFO, DEFAULT_LOG_FILE_ZIP_ARCH, DEFAULT_LOG_LABEL } from 'src/defaults';
import { isInteger } from 'utils/validation';
import { AppConfig } from '../appConfig.types';

export default (env: NodeJS.ProcessEnv) =>
  (appConfig: AppConfig = {} as AppConfig): AppConfig => ({
    ...appConfig,
    logger: {
      label: env.LOG_LABEL || DEFAULT_LOG_LABEL,
      dir: env.LOG_DIR || DEFAULT_LOG_DIR,
      fileLevel: env.LOG_FILE_LEVEL || DEFAULT_LOG_FILE_LEVEL,
      fileNameInfo: env.LOG_FILE_NAME_INFO || DEFAULT_LOG_FILE_NAME_INFO,
      fileNameError: env.LOG_FILE_NAME_ERROR || DEFAULT_LOG_FILE_NAME_ERROR,
      fileDatePattern: env.LOG_FILE_DATE_PATTERN || DEFAULT_LOG_FILE_DATE_PATTERN,
      fileZipArchive: !!env.LOG_FILE_ZIP_ARCH && isInteger(env.LOG_FILE_ZIP_ARCH) ? Number(env.LOG_FILE_ZIP_ARCH) === 1 : DEFAULT_LOG_FILE_ZIP_ARCH,
      fileMaxSize: !!env.LOG_FILE_MAX_SIZE && (isInteger(env.LOG_FILE_MAX_SIZE) && Number(env.LOG_FILE_MAX_SIZE) || env.LOG_FILE_MAX_SIZE) || DEFAULT_LOG_FILE_MAX_SIZE,
      fileMaxFiles: !!env.LOG_FILE_MAX_FILES && (isInteger(env.LOG_FILE_MAX_FILES) && Number(env.LOG_FILE_MAX_FILES) || env.LOG_FILE_MAX_FILES) || DEFAULT_LOG_FILE_MAX_FILES,
      consoleLevel: env.LOG_CONSOLE_LEVEL || DEFAULT_LOG_CONSOLE_LEVEL,
      consoleEnable: !!env.LOG_CONSOLE_ENABLE && isInteger(env.LOG_CONSOLE_ENABLE) ? Number(env.LOG_CONSOLE_ENABLE) === 1 : DEFAULT_LOG_CONSOLE_ENABLE
    }
  });
