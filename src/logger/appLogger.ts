import init from './init/init';
import messageDebug from './messageDebug/messageDebug';
import messageError from './messageError/messageError';
import messageInfo from './messageInfo/messageInfo';

import { IAppLogger } from './appLogger.types';

function AppLogger (): void {
  this.logger = null;

  this.init = this.init.bind(this);
  this.error = this.error.bind(this);
  this.debug = this.debug.bind(this);
  this.info = this.info.bind(this);
}

AppLogger.prototype.init = init;
AppLogger.prototype.error = messageError;
AppLogger.prototype.debug = messageDebug;
AppLogger.prototype.info = messageInfo;

const logger: IAppLogger = new AppLogger();

export default logger;
