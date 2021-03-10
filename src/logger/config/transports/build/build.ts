import transportsUnbound from './build.unbound';
import { transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as SplunkStreamEvent from 'winston-splunk-httplogger';

export default transportsUnbound(transports, DailyRotateFile, SplunkStreamEvent);
