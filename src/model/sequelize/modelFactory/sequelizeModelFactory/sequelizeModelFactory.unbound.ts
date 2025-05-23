import { Sequelize } from 'sequelize/types';
import { Logger } from 'winston';

import { PluginSdkSequelize } from '../modelFactory.types';

const start = async (sequelize: Sequelize, logger: Logger, allowSync: boolean): Promise<void> =>
  sequelize.authenticate()
    .then((_) => allowSync
      ? sequelize.sync()
      : Promise.resolve(sequelize)
    )
    .then((_) => {
      logger.info(`Connection to the database has been established successfully${allowSync ? ' and tables has been created.' : '.'}`);
    });

const stop = async (sequelize: Sequelize, logger: Logger): Promise<void> =>
  sequelize.close()
    .then((_) => { logger.info('Connection to the database has been closed successfully.'); });

export default (logger: Logger) =>
  (allowSync: boolean) =>
    (sequelize: Sequelize): PluginSdkSequelize => ({
      start: start.bind(null, sequelize, logger, allowSync),
      stop: stop.bind(null, sequelize, logger),
      sequelize
    });
