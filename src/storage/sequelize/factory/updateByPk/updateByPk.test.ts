import updateByPkUnbound from './updateByPk.unbound';
import { expect as expectChai } from 'chai';
import { DataTypes, Model, Options, Sequelize } from 'sequelize';
import { EDatabaseDialect } from 'web/server/configuration/loader/database/databaseConfig.types';
import { AppError } from 'common/error';
import { NotFound } from 'common/httpErrors';
import { Either } from 'tsmonad';
import { SequelizeIncludes } from 'service/sequelize/types';

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
        const NOT_FOUND_MSG = `Cannot find entity identified by id = '${ITEMS.id}'`;
        let notFound: NotFound = new NotFound(NOT_FOUND_MSG);
        let sequelize: Sequelize;
        let model: Model;
        let errorHandler: jest.Mock<AppError, [Error, string]>;
        let result: Either<AppError, MyModel>;

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
          beforeAll(async () => {
            jest.clearAllMocks();
            MyModel.update = jest.fn().mockResolvedValue([1]);
            MyModel.findAndCountAll = jest.fn().mockResolvedValue({ rows: [model], count: 1 });

            result = await updateByPkUnbound
              .apply(null, [errorHandler])
              .apply(null, [MyModel])
              .apply(null, [ITEMS, {}, INCLUDES, notFound]);
          });

          it(`Should return Either with exact model in right side, if record has been updated`, () => {
            result.do({
              right: (myModel: MyModel): void => {
                expectChai(myModel)
                  .to.be.an({}.constructor.name);
                expectChai(myModel)
                  .to.be.deep.equal(model);
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });
        });

        describe(`Error path - not found`, () => {
          beforeAll(async () => {
            jest.clearAllMocks();
            MyModel.update = jest.fn().mockResolvedValue([0]);

            result = await updateByPkUnbound
              .apply(null, [errorHandler])
              .apply(null, [MyModel])
              .apply(null, [ITEMS, {}, INCLUDES, notFound]);
          });

          it(`Should return Either with exact error (NotFound) in left side, if record has not been found in DB`, () => {
            result.do({
              right: (): void => fail(`Right side has not been expected`),
              left: (error: AppError) => {
                expect(error)
                  .toBeInstanceOf(NotFound);
                expect(error.message)
                  .toEqual(NOT_FOUND_MSG);
              }
            });
          });
        });

        describe(`Error path - model.update reject`, () => {
          const ERROR_MESSAGE = `error description...`;
          let seqError: Error = new Error(ERROR_MESSAGE);
          beforeAll(async () => {
            jest.clearAllMocks();
            MyModel.update = jest.fn().mockRejectedValue(seqError);

            result = await updateByPkUnbound
              .apply(null, [errorHandler])
              .apply(null, [MyModel])
              .apply(null, [ITEMS, {}, INCLUDES, notFound]);
          });

          it(`Should return Either with exact error (AppError) in left side, if error has been thrown`, () => {
            result.do({
              right: (): void => fail(`Right side has not been expected`),
              left: (error: AppError) => {
                expect(error)
                  .toBeInstanceOf(AppError);
                expect(error.message)
                  .toEqual('Internal Server Error');
              }
            });
          });
        });
      });
    });
  });
});
