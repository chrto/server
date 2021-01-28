import { DataTypes } from 'sequelize';

import pluginSdkModelUnbound from './modelFactory.unbound';
import getSequelizeConfig from './sequelizeConfig/sequelizeConfig';
import initSequelize from './sequelizeInit/sequelizeInit';
import getSequelizeInstance from './sequelizeInstance/sequelizeInstance';
import sequelizeModelFactory from './sequelizeModelFactory/sequelizeModelFactory';

DataTypes.DATE.prototype._stringify = function _stringify(date, options) {
  date = this._applyTimezone(date, options);

  // Z here means current timezone, _not_ UTC
  // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
  return date.format('YYYY-MM-DD HH:mm:ss.SSS');
};

export default pluginSdkModelUnbound.apply(null, [getSequelizeConfig, getSequelizeInstance, initSequelize, sequelizeModelFactory]);
