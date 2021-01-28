import { Options, Sequelize } from 'sequelize';
import { IDatabaseConfig } from 'web/server/configuration/loader/database/databaseConfig.types';
import { Maybe } from 'tsmonad';

import { PluginSdkSequelize } from './modelFactory.types';

export default (
  getSequelizeConfig: (dbConfig: IDatabaseConfig) => Options,
  getSequelizeInstance: (sequelizeConfig: Options) => Sequelize,
  initSequelize: (sequelize: Sequelize) => Sequelize,
  sequelizeModelFactory: (allowSync: boolean) => (sequelize: Sequelize) => PluginSdkSequelize
) =>
  (dbConfig: IDatabaseConfig): PluginSdkSequelize =>
    Maybe.just<IDatabaseConfig>(dbConfig)
      .lift(getSequelizeConfig)
      .lift(getSequelizeInstance)
      .lift(initSequelize)
      .lift(sequelizeModelFactory(dbConfig.allowSync))
      .caseOf({
        just: (pluginSdkSequelize: PluginSdkSequelize) => pluginSdkSequelize,
        nothing: () => null
      });
