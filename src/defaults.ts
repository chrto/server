import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';

export const DEFAULT_SERVER_API_PORT = 8000;
export const DEFAULT_SERVER_SHUTDOWN_PORT = 8001;
export const DEFAULT_SERVER_SHUTDOWN_TIMEOUT = 2000;
export const DEFAULT_SERVER_STARTUP_DELAY = 1000;
export const DEFAULT_SERVER_RETRY_COUNT = 10;

export const DEFAULT_DB_URL = 'storage/database.sqlite';
export const DEFAULT_DB_ALLOW_LOGGING = false;
export const DEFAULT_DB_ALLOW_SYNC = true;
export const DEFAULT_DB_DIALECT = EDatabaseDialect.sqlite;

export const DEFAULT_SSO_HASH_ALG = 'RS256';

export const WORK_DIR = `${__dirname}/../`;

export const DEFAULT_LOG_LABEL = 'SERVER';
export const DEFAULT_LOG_DIR = `${WORK_DIR}logs`;
export const DEFAULT_LOG_FILE_LEVEL = 'debug';
export const DEFAULT_LOG_FILE_NAME_INFO = 'info-%DATE%.log';
export const DEFAULT_LOG_FILE_NAME_ERROR = 'error-%DATE%.log';
export const DEFAULT_LOG_FILE_NAME_EXCEPTIONS = 'exceptions.log';
export const DEFAULT_LOG_FILE_DATE_PATTERN = 'YYYY-MM-DD';
export const DEFAULT_LOG_FILE_ZIP_ARCH = true;
export const DEFAULT_LOG_FILE_MAX_SIZE = '10m';
export const DEFAULT_LOG_FILE_MAX_FILES = '14d';
export const DEFAULT_LOG_CONSOLE_LEVEL = 'debug';
export const DEFAULT_LOG_CONSOLE_ENABLE = true;
