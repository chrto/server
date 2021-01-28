import sequelizeModelFactoryUnbound from 'model/sequelize/modelFactory/sequelizeModelFactory/sequelizeModelFactory.unbound';
import { AsyncStartStop, PluginSdkSequelize } from 'model/sequelize/modelFactory/modelFactory.types';
import { Sequelize } from 'sequelize/types';
import { Logger } from 'winston';
import { Fcn } from 'common/types';

import sdkStartStopFactory from './sdkStartStop';

describe(`service`, () => {
  describe(`pluginSdkService module`, () => {
    describe(`sdkStarStop`, () => {
      let sdkSequelize: PluginSdkSequelize;
      let sequelize: Sequelize = {} as Sequelize;
      let logger: Logger = {} as Logger;
      let sequelizeModelFactory: Fcn<[boolean], (sequelize: Sequelize) => PluginSdkSequelize>;
      let sdkStartStop: AsyncStartStop;

      beforeAll(() => {
        logger.info = jest.fn().mockImplementation((_message: string): Logger => logger);

        sequelize.authenticate = jest.fn().mockImplementation((): Promise<void> => Promise.resolve());
        sequelize.close = jest.fn().mockImplementation((): Promise<void> => Promise.resolve());

        sequelizeModelFactory = sequelizeModelFactoryUnbound.apply(null, [logger]);
        sdkSequelize = sequelizeModelFactory = sequelizeModelFactory
          .apply(null, [false])
          .apply(null, [sequelize]);

        sdkStartStop = sdkStartStopFactory(sdkSequelize);
      });

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('pluginSdkService.start should establis connection to the database', () => {
        sdkStartStop.start();
        expect(sequelize.authenticate)
          .toHaveBeenCalledWith();
      });
      it('pluginSdkService.stop should close connection to the database', () => {
        sdkStartStop.stop();
        expect(sequelize.close)
          .toHaveBeenCalledWith();
      });
    });
  });
});
