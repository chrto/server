import { expect as expectChai } from 'chai';
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
        expectChai(pluginSdkSequelize)
          .to.be.an('object');
        expectChai(pluginSdkSequelize)
          .to.haveOwnProperty('sequelize');
        expectChai(pluginSdkSequelize)
          .to.haveOwnProperty('start');
        expectChai(pluginSdkSequelize)
          .to.haveOwnProperty('stop');
      });
      describe(`plugin sdk sequelize 'start' property`, () => {
        it('Should test the connection by trying to authenticate', () => {
          pluginSdkSequelize.start().then(() => {
            expect(sequelize.authenticate).toBeCalled();
          });
        });
        it('Should log info message, if test pass', () => {
          pluginSdkSequelize.start()
            .then(() => {
              expect(logger.info).toBeCalledWith('Connection to the database has been established successfully.');
            });
        });
        it('Should not sync all defined models to the DB, if allowSync is set to false.', () => {
          pluginSdkSequelize.start()
            .then(() => {
              expect(sequelize.sync).not.toBeCalled();
            });
        });
        it('Should sync all defined models to the DB, if allowSync is set to true', () => {
          pluginSdkSequelize_AllowSycn.start()
            .then(() => {
              expect(sequelize.sync).toBeCalled();
            });
        });
        it('Should log info message, if test pass and models are sync', () => {
          pluginSdkSequelize_AllowSycn.start()
            .then(() => {
              expect(logger.info).toBeCalledWith('Connection to the database has been established successfully and tables has been created.');
            });
        });
      });

      describe(`plugin sdk sequelize 'stop' property`, () => {
        it('Should close all connections used by this sequelize instance, and free all references so the instance can be garbage collected.', () => {
          pluginSdkSequelize.stop().then(() => {
            expect(sequelize.close).toBeCalled();
          });
        });

        it('Should log info message, connections are closed', () => {
          pluginSdkSequelize_AllowSycn.stop()
            .then(() => {
              expect(logger.info).toBeCalledWith('Connection to the database has been closed successfully.');
            });
        });
      });
    });
  });
});
