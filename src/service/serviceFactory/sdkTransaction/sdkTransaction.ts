import { AppError } from 'common/error';
import { PluginSdkSequelize, SdkTransaction } from 'model/sequelize/modelFactory/modelFactory.types';
import { Transaction } from 'sequelize/types';
import { Either } from 'tsmonad';

export default (sdkSequelize: PluginSdkSequelize): SdkTransaction => ({
  begin: async (): Promise<Transaction> => sdkSequelize.sequelize.transaction({ autocommit: false }),
  commitOrRollback: (transaction: Transaction) =>
    <T>(dataOrError: Either<AppError, T>): PromiseLike<Either<AppError, T>> =>
      dataOrError.caseOf({
        right: (data: T) => transaction.commit().then(() => Either.right<AppError, T>(data)),
        left: (error: AppError) => transaction.rollback().then(() => Either.left<AppError, T>(error))
      }),
  rollback: (transaction: Transaction) =>
    <T>(err: AppError): PromiseLike<Either<AppError, T>> =>
      transaction.rollback().then(() => Either.left<AppError, T>(err))
});
