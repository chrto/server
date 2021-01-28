import messageTemplate from './messageTemplate';
import { LoggerOptions } from 'express-winston';
import { transportsDefinition } from 'utils/logger';

const expressLoggerOptions: LoggerOptions = {
  transports: transportsDefinition,
  expressFormat: false,
  msg: messageTemplate
};

export default expressLoggerOptions;
