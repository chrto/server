import { expect as expectChai } from 'chai';
import { Options, Sequelize } from 'sequelize';
import { EDatabaseDialect, IDatabaseConfig } from 'web/server/configuration/loader/database/databaseConfig.types';

import pluginSdkModelUnbound from './modelFactory.unbound';
import { PluginSdkSequelize } from './modelFactory.types';

describe('sequelize model', () => {
  describe('model factory', () => {
    describe('pluginSdkModel', () => {
      const dbConfig: IDatabaseConfig = {
        url: 'storage/database.sqlite',
        dialect: EDatabaseDialect.sqlite,
        allowSync: false,
        allowLogging: false
      };

      let mockGetSequelizeConfig: jest.Mock<Options, [IDatabaseConfig]>;
      let mockGetSequelizeInstance: jest.Mock<Sequelize, [Options]>;
      let mockInitSequelize: jest.Mock<Sequelize, [Sequelize]>;
      let mockSequelizeModelFactory: jest.Mock<(sequelize: Sequelize) => PluginSdkSequelize, [boolean]>;

      let pluginSdkModel: (dbConfig: IDatabaseConfig) => PluginSdkSequelize;
      let sdkModel: PluginSdkSequelize;

      beforeAll(() => {
        mockGetSequelizeConfig = jest.fn((dbConfig: IDatabaseConfig): Options => ({
          dialect: dbConfig.dialect,
          storage: dbConfig.url,
          logging: dbConfig.allowLogging,
          define: {
            timestamps: true
          }
        }));

        mockGetSequelizeInstance = jest.fn((_sequelizeConfig: Options): Sequelize => ({} as Sequelize));
        mockInitSequelize = jest.fn((sequelize: Sequelize): Sequelize => sequelize);
        mockSequelizeModelFactory = jest.fn((_allowSync: boolean) => (sequelize: Sequelize): PluginSdkSequelize => ({
          sequelize,
          start: null,
          stop: null
        }));
        pluginSdkModel = pluginSdkModelUnbound.apply(null, [mockGetSequelizeConfig, mockGetSequelizeInstance, mockInitSequelize, mockSequelizeModelFactory]);
        sdkModel = pluginSdkModel(dbConfig);
      });

      it('Should have exact properties', () => {
        expectChai(sdkModel)
          .to.haveOwnProperty('sequelize');
        expectChai(sdkModel)
          .to.haveOwnProperty('start');
        expectChai(sdkModel)
          .to.haveOwnProperty('stop');
      });

      it('Should call all function in chain with exact parameters', () => {
        expect(mockGetSequelizeConfig).toHaveBeenCalledWith(dbConfig);
        expect(mockGetSequelizeInstance).toHaveBeenCalledWith({
          dialect: dbConfig.dialect,
          storage: dbConfig.url,
          logging: dbConfig.allowLogging,
          define: {
            timestamps: true
          }
        });
        expect(mockInitSequelize).toHaveBeenCalledWith(sdkModel.sequelize);
        expect(mockSequelizeModelFactory).toHaveBeenCalledWith(false);

      });

      it(`Should call 'getSequelizeConfig' before 'getSequelizeInstance'`, () => {
        expect(mockGetSequelizeConfig).toHaveBeenCalledBefore(mockGetSequelizeInstance);
      });

      it(`Should call 'getSequelizeInstance' before 'initSequelize'`, () => {
        expect(mockGetSequelizeInstance).toHaveBeenCalledBefore(mockInitSequelize);
      });

      it(`Should call 'initSequelize' before 'sequelizeModelFactory'`, () => {
        expect(mockInitSequelize).toHaveBeenCalledBefore(mockSequelizeModelFactory);
      });
    });
  });
});
