import { EDatabaseDialect, IDatabaseConfig } from 'web/server/configuration/loader/database/databaseConfig.types';
import buildSequelizeConfig from './sequelizeConfig';
import { Options } from 'sequelize';

describe('sequelize model', () => {
  describe('model factory', () => {
    describe('sequelize configuration', () => {
      const dbConfig: IDatabaseConfig = {
        url: 'storage/database.sqlite',
        dialect: EDatabaseDialect.sqlite,
        allowSync: false,
        allowLogging: false
      };
      it(`Should build sequelize configuration`, () => {
        const expected: Options = {
          dialect: dbConfig.dialect,
          storage: dbConfig.url,
          logging: dbConfig.allowLogging,
          define: {
            timestamps: true
          }
        };
        const result = buildSequelizeConfig(dbConfig);

        expect(result).toBeObject;
        expect(result).toStrictEqual(expected);
      });
    });
  });
});
