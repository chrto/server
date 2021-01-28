import { Options } from 'sequelize/types';
import { Sequelize } from 'sequelize';

export default (sequelizeConfig: Options): Sequelize => new Sequelize(sequelizeConfig);
