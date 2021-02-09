import sequelizeStorage from './sequelizeStorage';
import { expect as expectChai } from 'chai';
import { SequelizeStorage } from './sequelizeStorage.types';

describe('Storage', () => {
  describe('Sequelize', () => {
    describe('Factory', () => {
      let storage: SequelizeStorage<any>;

      beforeAll(() => {
        storage = sequelizeStorage
          .apply(null, [{}]);
      });

      it('Happy path', () => {
        expectChai(storage)
          .to.be.an('object');
        expectChai(storage)
          .which.haveOwnProperty('findAll');
        expectChai(storage)
          .which.haveOwnProperty('findOne');
        expectChai(storage)
          .which.haveOwnProperty('findAndCountAll');
        expectChai(storage)
          .which.haveOwnProperty('findByPk');
        expectChai(storage)
          .which.haveOwnProperty('updateByPk');
        expectChai(storage)
          .which.haveOwnProperty('update');
        expectChai(storage)
          .which.haveOwnProperty('create');
        expectChai(storage)
          .which.haveOwnProperty('bulkCreate');
        expectChai(storage)
          .which.haveOwnProperty('destroy');
      });
    });
  });
});
