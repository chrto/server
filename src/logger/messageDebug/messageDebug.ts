import { IAppLogger } from '../appLogger.types';

export default function (message?: string, silent: boolean = false): IAppLogger {
  !silent && this.logger.debug(message);
  return this;
}
