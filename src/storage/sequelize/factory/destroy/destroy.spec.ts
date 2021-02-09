import destroyUnbound from './destroy.unbound';
import { DataTypes, DestroyOptions, Model, Options, Sequelize } from 'sequelize';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import { AppError } from 'common/error';

class MyModel extends Model {
  public readonly id!: string;
}

const SEQUELIZE_CONFIG: Options = {
  dialect: EDatabaseDialect.sqlite
};

const APP_ERROR: AppError = new AppError('500', 'Internal Server Error');
const OPTIONS: DestroyOptions = { truncate: true };

describe('Storage', () => {
  describe('Sequelize', () => {
    describe('Factory', () => {
      describe(`destroy`, () => {
        let sequelize: Sequelize;
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
          errorHandler = jest.fn().mockReturnValue(APP_ERROR);
        });

        describe(`Happy path`, () => {
          beforeAll(() => {
            jest.clearAllMocks();
            MyModel.destroy = jest.fn().mockResolvedValue(1);

            destroyUnbound
              .apply(null, [errorHandler])
              .apply(null, [MyModel])
              .apply(null, [OPTIONS]);
          });

          it(`Should make exact calls`, () => {
            expect(MyModel.destroy)
              .toHaveBeenCalledTimes(1);
            expect(MyModel.destroy)
              .toHaveBeenCalledWith(OPTIONS);

            expect(errorHandler)
              .toHaveBeenCalledTimes(0);
          });
        });

        describe(`Error path`, () => {
          const ERROR_MESSAGE = `error description...`;
          let error: Error = new Error(ERROR_MESSAGE);
          beforeAll(() => {
            jest.clearAllMocks();
            MyModel.destroy = jest.fn().mockRejectedValue(error);

            destroyUnbound
              .apply(null, [errorHandler])
              .apply(null, [MyModel])
              .apply(null, [OPTIONS]);
          });

          it(`Should make exact calls`, () => {
            expect(MyModel.destroy)
              .toHaveBeenCalledTimes(1);
            expect(MyModel.destroy)
              .toHaveBeenCalledWith(OPTIONS);

            expect(errorHandler)
              .toHaveBeenCalledTimes(1);
            expect(errorHandler)
              .toHaveBeenCalledWith(error, `while trying to delete ${MyModel.name}:`);
          });
        });
      });
    });
  });
});
