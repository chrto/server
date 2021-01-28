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
