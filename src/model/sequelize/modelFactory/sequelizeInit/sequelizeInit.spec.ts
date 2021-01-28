import { expect as expectChai } from 'chai';
import { Sequelize } from 'sequelize/types';
import { InitModels } from './sequelizeInit.types';
import sequelizeInitUnbound from './sequelizeInit.unbound';

describe('sequelize model', () => {
  describe('model factory', () => {
    describe('init model', () => {
      let sequelizeInit: (sequelize: Sequelize) => Sequelize;
      let initModel: InitModels;
      const sequelize: Sequelize = {} as Sequelize;

      beforeAll(() => {
        initModel = {
          userModel: jest.fn().mockImplementation((_sequelize: Sequelize): void => null)
        };
        sequelizeInit = sequelizeInitUnbound.apply(null, [initModel]);
      });

      it('Should init User sequelize model', () => {
        sequelizeInit(sequelize);
        expect(initModel.userModel).toHaveBeenCalled();
      });

      it('Should return sequelize instance', () => {
        const result = sequelizeInit(sequelize);
        expectChai(result)
          .to.be.deep.equal(sequelize);
      });
    });
  });
});
