import { AppError } from 'common/error';
import { Conflict } from 'common/httpErrors';
import { ExclusionConstraintError, ForeignKeyConstraintError, SequelizeScopeError, UniqueConstraintError, ValidationError } from 'sequelize';
import logger from 'utils/logger';

const getErrorMessage = (error: Error): string =>
  [
    (error as any).message ? 'message: ' + (error as any).message : '',
    (error as any).errors ? (error as any).errors.map((error: Error) => error.message) : ''
  ]
    .filter((item) => item !== '')
    .join('\n');

const createErrorLogMessage = (error: Error, msg?: string): string =>
  [
    !!msg ? msg : '',
    (error as any).name ? 'name: ' + (error as any).name : '',
    getErrorMessage(error),
    (error as any).sql ? 'sql: ' + (error as any).sql : '',
    (error as any).stack ? 'stack: ' + (error as any).stack : ''
  ]
    .filter((item) => item !== '')
    .join('\n');

export default (error: Error, message?: string): AppError => {
  logger.error(createErrorLogMessage(error, message));

  if (
    error instanceof ExclusionConstraintError ||
    error instanceof ForeignKeyConstraintError ||
    error instanceof UniqueConstraintError ||
    error instanceof ValidationError ||
    error instanceof SequelizeScopeError
  ) {
    return new Conflict(getErrorMessage(error));
  } else {
    return new AppError('500', 'Internal Server Error');
  }
};
