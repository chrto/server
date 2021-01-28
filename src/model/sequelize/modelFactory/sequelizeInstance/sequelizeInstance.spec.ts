import { expect as expectChai } from 'chai';
import { Options } from 'sequelize/types';
import { Sequelize } from 'sequelize';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import getSequelizeInstance from './sequelizeInstance';

describe('sequelize model', () => {
  describe('model factory', () => {
    describe('sequelize', () => {
      const sequelizeConfig: Options = {
        dialect: EDatabaseDialect.sqlite,
        storage: 'storage/database.sqlite',
        logging: false,
        define: {
          timestamps: true
        }
      };
      it('Should create new sequelize class instance', () => {
        const sequelize: Sequelize = getSequelizeInstance(sequelizeConfig);
        expectChai(sequelize)
          .to.be.instanceOf(Sequelize);
      });
    });
  });
});
