import { IAppLogger } from '../appLogger.types';

export default function (message?: string): IAppLogger {
  this.logger.error(message);
  return this;
}
