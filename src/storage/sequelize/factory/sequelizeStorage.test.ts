import sequelizeStorage from './sequelizeStorage';
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
        expect(storage).toBeInstanceOf(Object);
        expect(storage).toHaveProperty('findAll');
        expect(storage).toHaveProperty('findOne');
        expect(storage).toHaveProperty('findAndCountAll');
        expect(storage).toHaveProperty('findByPk');
        expect(storage).toHaveProperty('updateByPk');
        expect(storage).toHaveProperty('update');
        expect(storage).toHaveProperty('create');
        expect(storage).toHaveProperty('bulkCreate');
        expect(storage).toHaveProperty('destroy');
      });
    });
  });
});
