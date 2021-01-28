import { errorLogger } from 'express-winston';
import expressLoggerOptions from '../options/options';

export default errorLogger(expressLoggerOptions);
