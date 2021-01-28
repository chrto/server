import { expect as expectChai } from 'chai';
import { DEFAULT_DB_ALLOW_LOGGING, DEFAULT_DB_ALLOW_SYNC, DEFAULT_DB_DIALECT, DEFAULT_DB_URL } from 'src/defaults';
import { AppConfig, AppConfigLoader } from '../appConfig.types';
import { EDatabaseDialect, IDatabaseConfig } from './databaseConfig.types';
import databaseConfigUnbound from './databaseConfig.unbound';

describe('server configuration module', () => {
  describe(`'database'`, () => {
    const env = {
      SA_PASSWORD: 'SA_Secret',
      DB_USER: 'user',
      DB_PASS: 'secret',
      DB_SCHEMA: 'schema',
      DB_HOST: 'db',
      DB_PORT: '1433',
      DB_ALLOW_SYNC: '1',
      DB_ALLOW_LOGGING: '0',
      DB_DIALECT: EDatabaseDialect.mssql
    };

    it(`Should use values from environment, if exists.`, () => {
      const expected: IDatabaseConfig = {
        url: `mssql://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_SCHEMA}`,
        allowLogging: false,
        allowSync: true,
        dialect: env.DB_DIALECT
      };
      const databaseConfig: AppConfigLoader<AppConfig> = databaseConfigUnbound.apply(null, [env]);

      expectChai(databaseConfig())
        .to.haveOwnProperty('database')
        .which.is.deep.equal(expected);
    });

    it(`Should use values from 'defaults.ts', if does not find in environment.`, () => {
      const expected: IDatabaseConfig = {
        url: DEFAULT_DB_URL,
        allowLogging: DEFAULT_DB_ALLOW_LOGGING,
        allowSync: DEFAULT_DB_ALLOW_SYNC,
        dialect: DEFAULT_DB_DIALECT
      };
      const databaseConfig: AppConfigLoader<AppConfig> = databaseConfigUnbound.apply(null, [{}]);

      expectChai(databaseConfig())
        .to.haveOwnProperty('database')
        .which.is.deep.equal(expected);
    });
  });
});
