import { Fcn } from 'common/types';
import { Sequelize } from 'sequelize/types';
import { Logger } from 'winston';

import sequelizeModelFactoryUnbound from './sequelizeModelFactory.unbound';
import { PluginSdkSequelize } from '../modelFactory.types';

describe('sequelize model', () => {
  describe('model factory', () => {
    describe('sequelize model factory', () => {
      let logger: Logger = {} as Logger;
      let sequelize: Sequelize = {} as Sequelize;
      let sequelizeModelFactory: Fcn<[boolean], (sequelize: Sequelize) => PluginSdkSequelize>;
      let pluginSdkSequelize: PluginSdkSequelize;
      let pluginSdkSequelize_AllowSycn: PluginSdkSequelize;

      beforeAll(() => {
        logger.info = jest.fn().mockImplementation((_message: string): Logger => logger);
        sequelize.authenticate = jest.fn().mockImplementation((): Promise<void> => Promise.resolve());
        sequelize.sync = jest.fn().mockImplementation((): Promise<void> => Promise.resolve());
        sequelize.close = jest.fn().mockImplementation((): Promise<void> => Promise.resolve());
        sequelizeModelFactory = sequelizeModelFactoryUnbound.apply(null, [logger]);
        pluginSdkSequelize = sequelizeModelFactory
          .apply(null, [false])
          .apply(null, [sequelize]);
        pluginSdkSequelize_AllowSycn = sequelizeModelFactory
          .apply(null, [true])
          .apply(null, [sequelize]);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('Should return object with specified properties', () => {
        expect(pluginSdkSequelize).toBeObject;
        expect(pluginSdkSequelize).toHaveProperty('sequelize');
        expect(pluginSdkSequelize).toHaveProperty('start');
        expect(pluginSdkSequelize).toHaveProperty('stop');
      });
      describe(`plugin sdk sequelize 'start' property`, () => {
        it('Should test the connection by trying to authenticate', () => {
          pluginSdkSequelize.start().then(() => {
            expect(sequelize.authenticate).toHaveBeenCalled();
          });
        });
        it('Should log info message, if test pass', () => {
          pluginSdkSequelize.start()
            .then(() => {
              expect(logger.info).toHaveBeenCalledWith('Connection to the database has been established successfully.');
            });
        });
        it('Should not sync all defined models to the DB, if allowSync is set to false.', () => {
          pluginSdkSequelize.start()
            .then(() => {
              expect(sequelize.sync).not.toHaveBeenCalled();
            });
        });
        it('Should sync all defined models to the DB, if allowSync is set to true', () => {
          pluginSdkSequelize_AllowSycn.start()
            .then(() => {
              expect(sequelize.sync).toHaveBeenCalled();
            });
        });
        it('Should log info message, if test pass and models are sync', () => {
          pluginSdkSequelize_AllowSycn.start()
            .then(() => {
              expect(logger.info).toHaveBeenCalledWith('Connection to the database has been established successfully and tables has been created.');
            });
        });
      });

      describe(`plugin sdk sequelize 'stop' property`, () => {
        it('Should close all connections used by this sequelize instance, and free all references so the instance can be garbage collected.', () => {
          pluginSdkSequelize.stop().then(() => {
            expect(sequelize.close).toHaveBeenCalled();
          });
        });

        it('Should log info message, connections are closed', () => {
          pluginSdkSequelize_AllowSycn.stop()
            .then(() => {
              expect(logger.info).toHaveBeenCalledWith('Connection to the database has been closed successfully.');
            });
        });
      });
    });
  });
});
