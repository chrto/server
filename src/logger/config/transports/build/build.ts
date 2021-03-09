import transportsUnbound from './build.unbound';
import { transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export default transportsUnbound(transports, DailyRotateFile);
