import { IAppLogger } from '../appLogger.types';

export default function (message?: string): IAppLogger {
  this.logger.info(message);
  return this;
}
