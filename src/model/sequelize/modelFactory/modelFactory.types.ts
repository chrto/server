import { Sequelize, Transaction } from 'sequelize';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';

export interface Entity<ID> {
  id: ID;
}

export interface AsyncStartStop {
  readonly start: () => Promise<void>;
  readonly stop: () => Promise<void>;
}

export interface SdkTransaction {
  begin: () => Promise<Transaction>;
  commitOrRollback: (transaction: Transaction) => <T> (dataOrError: Either<AppError, T>) => PromiseLike<Either<AppError, T>>;
  rollback: <T>(transaction: Transaction) => (err: AppError) => PromiseLike<Either<AppError, T>>;
}

export interface PluginSdkSequelize extends AsyncStartStop {
  readonly sequelize: Sequelize;
}

export interface TransactionContext {
  transaction?: Transaction;
}
