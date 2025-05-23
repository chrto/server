import sequelizeModelFactoryUnbound from 'model/sequelize/modelFactory/sequelizeModelFactory/sequelizeModelFactory.unbound';
import { PluginSdkSequelize, SdkTransaction } from 'model/sequelize/modelFactory/modelFactory.types';
import { Sequelize, Transaction } from 'sequelize';
import { Fcn } from 'common/types';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';

import sdkTransactionFactory from './sdkTransaction';

describe(`service`, () => {
  describe(`pluginSdkService module`, () => {
    describe(`sdkTransaction`, () => {
      const error: AppError = new AppError('code', 'message');
      let sdkSequelize: PluginSdkSequelize;
      let sequelize: Sequelize = {} as Sequelize;
      let transaction: Transaction = {} as Transaction;
      let sequelizeModelFactory: Fcn<[boolean], (sequelize: Sequelize) => PluginSdkSequelize>;
      let sdkTransaction: SdkTransaction;

      beforeAll(() => {
        transaction.commit = jest.fn().mockImplementation((): Promise<void> => Promise.resolve());
        transaction.rollback = jest.fn().mockImplementation((): Promise<void> => Promise.resolve());

        sequelize.transaction = jest.fn().mockResolvedValue(transaction);

        sequelizeModelFactory = sequelizeModelFactoryUnbound.apply(null, [null]);
        sdkSequelize = sequelizeModelFactory = sequelizeModelFactory
          .apply(null, [false])
          .apply(null, [sequelize]);
        sdkTransaction = sdkTransactionFactory(sdkSequelize);
      });

      beforeEach(() => {
        jest.clearAllMocks();
      });

      describe('sdkTransaction.begin()', () => {
        it(`Should begin sequelize transaction`, () => {
          sdkTransaction.begin()
            .then((_sequelizeTransaction: Transaction) => {
              expect(sdkSequelize.sequelize.transaction)
                .toHaveBeenCalledWith({ autocommit: false });
            });
        });
        it(`Should return 'Transaction' object`, () => {
          sdkTransaction.begin()
            .then((sequelizeTransaction: Transaction) => {
              expect(sequelizeTransaction).toBeObject;
              expect(sequelizeTransaction).toBe(transaction);
            });
        });
      });

      describe('sdkTransaction.commitOrRollback()', () => {
        it('Should commit transaction, if Either has right side', () => {
          sdkTransaction.commitOrRollback
            .apply(null, [transaction])
            .apply(null, [Either.right({})])
            .then(<T> (dataOrError: Either<AppError, T>) => {
              dataOrError.do({
                right: () => expect(transaction.commit)
                  .toHaveBeenCalledWith(),
                left: (error: AppError) => fail('Left side was not expected.' + '\n' + error.code + '\n' + error.message)
              });
            });
        });
        it('Should return Either with value in Right side, if Either has right side', () => {
          const value: any = {};
          sdkTransaction.commitOrRollback
            .apply(null, [transaction])
            .apply(null, [Either.right(value)])
            .then(<T> (dataOrError: Either<AppError, T>) => {
              dataOrError.do({
                right: <T> (value: T) => {
                  expect(value).toBeObject;
                  expect(value).toBe(value);

                },
                left: (error: AppError) => fail('Left side was not expected.' + '\n' + error.code + '\n' + error.message)
              });
            });
        });

        it('Should rollback sequelize transaction, if Either has left side', () => {
          sdkTransaction.commitOrRollback
            .apply(null, [transaction])
            .apply(null, [Either.left(error)])
            .then(<T> (dataOrError: Either<AppError, T>) => {
              dataOrError.do({
                right: () => fail('Error \'AppError\' was expected.'),
                left: (_error: AppError) => expect(transaction.rollback).toHaveBeenCalledWith()
              });
            });
        });

        it('Should return Either with error in Left side, if Either has left side', () => {
          sdkTransaction.commitOrRollback
            .apply(null, [transaction])
            .apply(null, [Either.left(error)])
            .then(<T> (dataOrError: Either<AppError, T>) => {
              dataOrError.do({
                right: () => fail('Error \'AppError\' was expected.'),
                left: (error: AppError) => expect(error).toBeInstanceOf(AppError)
              });
            });
        });
      });

      describe('sdkTransaction.rollback()', () => {
        it('Should rollback sequelize transaction', () => {
          sdkTransaction.rollback
            .apply(null, [transaction])
            .apply(null, [error])
            .then(<T> (dataOrError: Either<AppError, T>) => {
              dataOrError.do({
                right: () => fail('Error \'AppError\' was expected.'),
                left: (_error: AppError) => expect(transaction.rollback).toHaveBeenCalledWith()
              });
            });
        });
        it('Should return Either with error in Left side', () => {
          sdkTransaction.rollback
            .apply(null, [transaction])
            .apply(null, [error])
            .then(<T> (dataOrError: Either<AppError, T>) => {
              dataOrError.do({
                right: () => fail('Error \'AppError\' was expected.'),
                left: (error: AppError) => expect(error).toBeInstanceOf(AppError)
              });
            });
        });
      });
    });
  });
});
