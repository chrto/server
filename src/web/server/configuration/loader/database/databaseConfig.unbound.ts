import { DEFAULT_DB_ALLOW_LOGGING, DEFAULT_DB_ALLOW_SYNC, DEFAULT_DB_DIALECT, DEFAULT_DB_URL } from 'src/defaults';
import { isEnum } from 'utils/validation';
import { AppConfig } from '../appConfig.types';
import { EDatabaseDialect } from './databaseConfig.types';

const getDialect = (dialect: string): EDatabaseDialect => isEnum(EDatabaseDialect)(dialect) ? EDatabaseDialect[dialect] : DEFAULT_DB_DIALECT;

export default (env: NodeJS.ProcessEnv) =>
  (appConfig: AppConfig = {} as AppConfig): AppConfig => ({
    ...appConfig,
    database: {
      url: !!env.DB_USER && !!env.DB_PASS && !!env.DB_HOST && !!env.DB_PORT && !!env.DB_SCHEMA && `mssql://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_SCHEMA}` || DEFAULT_DB_URL,
      allowLogging: !!env.DB_ALLOW_SYNC && Number(env.DB_ALLOW_LOGGING) === 1 || DEFAULT_DB_ALLOW_LOGGING,
      allowSync: !!env.DB_ALLOW_SYNC && Number(env.DB_ALLOW_SYNC) === 1 || DEFAULT_DB_ALLOW_SYNC,
      dialect: getDialect(env.DB_DIALECT)
    }
  });
