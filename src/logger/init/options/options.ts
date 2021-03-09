import { LoggerOptions } from 'winston';
import { TransportsDefinition } from 'logger/config/transports/transports.types';

export default (transportsDefinition: TransportsDefinition): LoggerOptions => ({
  transports: transportsDefinition.logger,
  exceptionHandlers: transportsDefinition.exception
});
