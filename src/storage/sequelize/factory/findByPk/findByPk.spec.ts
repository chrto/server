import findByPkUnbound from './findByPk.unbound';
import { DataTypes, FindOptions, Model, Options, Sequelize } from 'sequelize';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import { AppError } from 'common/error';
import { NotFound } from 'common/httpErrors';

class MyModel extends Model {
  public readonly id!: string;
}

const ITEMS = {
  id: 'f923b2c9-ffcf-4a0a-bdc9-a4a4ae2a687e'
};

const SEQUELIZE_CONFIG: Options = {
  dialect: EDatabaseDialect.sqlite
};

const APP_ERROR: AppError = new AppError('500', 'Internal Server Error');
const OPTIONS: FindOptions = { include: [] };

describe('Storage', () => {
  describe('Sequelize', () => {
    describe('Factory', () => {
      describe(`find by primary key all`, () => {
        let notFound: NotFound = new NotFound(`Cannot find user identified by id = '${ITEMS.id}'`);
        let sequelize: Sequelize;
        let model: Model;
        let errorHandler: jest.Mock<AppError, [Error, string]>;

        beforeAll(() => {
          sequelize = new Sequelize(SEQUELIZE_CONFIG);
          MyModel.init({
            id: {
              allowNull: false,
              primaryKey: true,
              type: DataTypes.UUID
            }
          }, { sequelize });
          model = MyModel.build(ITEMS);
          errorHandler = jest.fn().mockReturnValue(APP_ERROR);
        });

        describe(`Happy path`, () => {
          beforeAll(() => {
            jest.clearAllMocks();
            MyModel.findByPk = jest.fn().mockResolvedValue(model);

            findByPkUnbound
              .apply(null, [errorHandler])
              .apply(null, [MyModel])
              .apply(null, [ITEMS.id, OPTIONS, notFound]);
          });

          it(`Should make exact calls`, () => {
            expect(MyModel.findByPk)
              .toHaveBeenCalledTimes(1);
            expect(MyModel.findByPk)
              .toHaveBeenCalledWith(ITEMS.id, OPTIONS);

            expect(errorHandler)
              .toHaveBeenCalledTimes(0);
          });
        });

        describe(`Error path`, () => {
          const ERROR_MESSAGE = `error description...`;
          let error: Error = new Error(ERROR_MESSAGE);
          beforeAll(() => {
            jest.clearAllMocks();
            MyModel.findByPk = jest.fn().mockRejectedValue(error);

            findByPkUnbound
              .apply(null, [errorHandler])
              .apply(null, [MyModel])
              .apply(null, [ITEMS.id, OPTIONS, notFound]);
          });

          it(`Should make exact calls`, () => {
            expect(MyModel.findByPk)
              .toHaveBeenCalledTimes(1);
            expect(MyModel.findByPk)
              .toHaveBeenCalledWith(ITEMS.id, OPTIONS);

            expect(errorHandler)
              .toHaveBeenCalledTimes(1);
            expect(errorHandler)
              .toHaveBeenCalledWith(error, `while looking for ${MyModel.name} with id '${ITEMS.id}':`);
          });
        });
      });
    });
  });
});
