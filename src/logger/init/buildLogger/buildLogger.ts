import buildLoggerUnbound from './buildLogger.unbound';
import { createLogger } from 'winston';

export default buildLoggerUnbound(createLogger);
