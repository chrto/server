import updateByPkUnbound from './updateByPk.unbound';
import { DataTypes, Model, Options, Sequelize } from 'sequelize';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import { AppError } from 'common/error';
import { SequelizeIncludes } from 'service/sequelize/types';
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
const INCLUDES: SequelizeIncludes = { include: [] };

describe('Storage', () => {
  describe('Sequelize', () => {
    describe('Factory', () => {
      describe(`update by primary key`, () => {
        let notFound: NotFound = new NotFound(`Cannot find entity identified by id = '${ITEMS.id}'`);
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
            MyModel.update = jest.fn().mockResolvedValue([1]);
            MyModel.findAndCountAll = jest.fn().mockResolvedValue({ rows: [model], count: 1 });

            updateByPkUnbound
              .apply(null, [errorHandler])
              .apply(null, [MyModel])
              .apply(null, [ITEMS, {}, INCLUDES, notFound]);
          });

          it(`Should make exact calls`, () => {
            expect(MyModel.update)
              .toHaveBeenCalledTimes(1);
            expect(MyModel.update)
              .toHaveBeenCalledWith(ITEMS, { where: { id: ITEMS.id }, ... {} });

            expect(MyModel.findAndCountAll)
              .toHaveBeenCalledTimes(1);
            expect(MyModel.findAndCountAll)
              .toHaveBeenCalledWith({ where: { id: ITEMS.id }, ... {}, ...INCLUDES });

            expect(errorHandler)
              .toHaveBeenCalledTimes(0);
          });
        });

        describe(`Error path`, () => {
          const ERROR_MESSAGE = `error description...`;
          let error: Error = new Error(ERROR_MESSAGE);
          beforeAll(() => {
            jest.clearAllMocks();
            MyModel.update = jest.fn().mockRejectedValue(error);

            updateByPkUnbound
              .apply(null, [errorHandler])
              .apply(null, [MyModel])
              .apply(null, [ITEMS, {}, INCLUDES, notFound]);
          });

          it(`Should make exact calls`, () => {
            expect(MyModel.update)
              .toHaveBeenCalledTimes(1);
            expect(MyModel.update)
              .toHaveBeenCalledWith(ITEMS, { where: { id: ITEMS.id }, ... {} });

            expect(errorHandler)
              .toHaveBeenCalledTimes(1);
            expect(errorHandler)
              .toHaveBeenCalledWith(error, `while trying to update ${MyModel.name}`);
          });
        });
      });
    });
  });
});
