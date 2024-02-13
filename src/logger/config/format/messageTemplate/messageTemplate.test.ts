import messageTemplate from './messageTemplate';
import { ILoggerConfig } from 'web/server/configuration/loader/logger/loggerConfig.types';
import { TransformableInfo } from 'logform';

const CONFIG: ILoggerConfig = { label: 'server', consoleLevel: 'debug' } as ILoggerConfig;
const TIME_STAMP: string = '2021-01-01T00:00:00.000Z';
const MESSAGE: string = 'message...';

const INFO: TransformableInfo = {
  message: MESSAGE,
  level: CONFIG.consoleLevel,
  label: `[${CONFIG.label}]`,
  timestamp: TIME_STAMP
};

describe('Logger', () => {
  describe('config', () => {
    describe(`format`, () => {
      describe(`message template`, () => {
        let result: string;

        beforeAll(() => {
          result = messageTemplate(INFO);
        });

        it(`Should log message in exact format`, () => {
          expect(result).toBeString;
          expect(result).toBe(`[${CONFIG.label}] ${TIME_STAMP} ${CONFIG.consoleLevel} ${MESSAGE}`);
        });
      });
    });
  });
});
