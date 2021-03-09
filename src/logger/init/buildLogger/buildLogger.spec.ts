import buildLoggerUnbound from './buildLogger.unbound';
import { Logger, LoggerOptions } from 'winston';

const LOGGER: Logger = {} as Logger;
const OPTIONS: LoggerOptions = {
  transports: []
};

describe('Logger', () => {
  describe(`methods`, () => {
    describe(`init`, () => {
      describe(`build logger`, () => {
        let createLogger: jest.Mock<Logger, [LoggerOptions]>;

        beforeAll(() => {
          createLogger = jest.fn().mockReturnValue(LOGGER);

          buildLoggerUnbound
            .apply(null, [createLogger])
            .apply(null, [OPTIONS]);
        });

        it(`Should create winston logger with exact options`, () => {
          expect(createLogger)
            .toHaveBeenCalledTimes(1);
          expect(createLogger)
            .toHaveBeenCalledWith(OPTIONS);
        });
      });
    });
  });
});
