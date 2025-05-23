import optionsUnbound from './options.unbound';
import { ColorizeOptions, Colorizer, Format } from 'logform';
import { ILoggerConfig } from 'web/server/configuration/loader/logger/loggerConfig.types';

const LOGFORM_FORMAT: Format = {} as Format;
const CONFIG: ILoggerConfig = {
  fileDatePattern: 'DD',
  fileZipArchive: true,
  dir: './logs',
  fileMaxSize: 1024,
  fileMaxFiles: '14d',
  consoleLevel: 'debug'
} as ILoggerConfig;

describe('Logger', () => {
  describe('config', () => {
    describe('transports', () => {
      describe('options', () => {
        let combine: jest.Mock<Format, [Format[]]>;
        let colorize: jest.Mock<Colorizer, [ColorizeOptions]>;

        beforeAll(() => {
          combine = jest.fn().mockReturnValue(LOGFORM_FORMAT);
          colorize = jest.fn().mockReturnValue(LOGFORM_FORMAT);

          optionsUnbound
            .apply(null, [{ combine, colorize }])
            .apply(null, [CONFIG])
            .apply(null, [LOGFORM_FORMAT]);
        });

        it(`Should colorize console log`, () => {
          expect(colorize)
            .toHaveBeenCalledTimes(1);
          expect(colorize)
            .toHaveBeenCalledWith({ all: true });

          expect(combine)
            .toHaveBeenCalledTimes(1);
          expect(combine)
            .toHaveBeenCalledWith(LOGFORM_FORMAT, LOGFORM_FORMAT);
        });
      });
    });
  });
});
