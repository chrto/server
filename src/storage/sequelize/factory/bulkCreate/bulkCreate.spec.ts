import bulkCreateUnbound from './bulkCreate.unbound';
import { CreateOptions, DataTypes, Model, Options, Sequelize, UniqueConstraintError } from 'sequelize';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import { AppError } from 'common/error';
import { Conflict } from 'common/httpErrors';

class MyModel extends Model {
  public readonly id!: string;
}

const ITEMS = {
  id: 'f923b2c9-ffcf-4a0a-bdc9-a4a4ae2a687e'
};

const SEQUELIZE_CONFIG: Options = {
  dialect: EDatabaseDialect.sqlite
};

const CONFLICT: Conflict = new Conflict('exists');
const OPTIONS: CreateOptions = { validate: true };

describe('Storage', () => {
  describe('Sequelize', () => {
    describe('Factory', () => {
      describe(`bulk create`, () => {
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
          errorHandler = jest.fn().mockReturnValue(CONFLICT);
        });

        describe(`Happy path`, () => {
          beforeAll(() => {
            jest.clearAllMocks();
            MyModel.bulkCreate = jest.fn().mockResolvedValue([model]);

            bulkCreateUnbound
              .apply(null, [errorHandler])
              .apply(null, [MyModel])
              .apply(null, [[ITEMS], OPTIONS]);
          });

          it(`Should make exact calls`, () => {
            expect(MyModel.bulkCreate)
              .toHaveBeenCalledTimes(1);
            expect(MyModel.bulkCreate)
              .toHaveBeenCalledWith([ITEMS], OPTIONS);

            expect(errorHandler)
              .toHaveBeenCalledTimes(0);
          });
        });

        describe(`Error path`, () => {
          const ERROR_MESSAGE = `email exists`;
          let error: Error = new UniqueConstraintError({ message: ERROR_MESSAGE, errors: [] });
          beforeAll(() => {
            jest.clearAllMocks();
            MyModel.bulkCreate = jest.fn().mockRejectedValue(error);

            bulkCreateUnbound
              .apply(null, [errorHandler])
              .apply(null, [MyModel])
              .apply(null, [[ITEMS], OPTIONS]);
          });

          it(`Should make exact calls`, () => {
            expect(MyModel.bulkCreate)
              .toHaveBeenCalledTimes(1);
            expect(MyModel.bulkCreate)
              .toHaveBeenCalledWith([ITEMS], OPTIONS);

            expect(errorHandler)
              .toHaveBeenCalledTimes(1);
            expect(errorHandler)
              .toHaveBeenCalledWith(error, `while trying to create ${MyModel.name}:`);
          });
        });
      });
    });
  });
});
