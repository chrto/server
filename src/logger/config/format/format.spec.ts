import formatUnbound from './format.unbound';
import { Format, LabelOptions, TransformableInfo } from 'logform';
import { Fcn } from 'common/types';
import { ILoggerConfig } from 'web/server/configuration/loader/logger/loggerConfig.types';

const LOGFORM_FORMAT: Format = {} as Format;
const CONFIG: ILoggerConfig = { label: 'server' } as ILoggerConfig;

describe('Logger', () => {
  describe('config', () => {
    describe(`format`, () => {
      let combine: jest.Mock<Format, [Format[]]>;
      let timestamp: jest.Mock<Format, []>;
      let label: jest.Mock<Format, [LabelOptions]>;
      let printf: jest.Mock<Format, [Fcn<[TransformableInfo], string>]>;
      let prettyPrint: jest.Mock<Format, []>;
      let json: jest.Mock<Format, []>;

      beforeAll(() => {
        combine = jest.fn().mockReturnValue(LOGFORM_FORMAT);
        timestamp = jest.fn().mockReturnValue(LOGFORM_FORMAT);
        label = jest.fn().mockReturnValue(LOGFORM_FORMAT);
        printf = jest.fn().mockReturnValue(LOGFORM_FORMAT);
        prettyPrint = jest.fn().mockReturnValue(LOGFORM_FORMAT);
        json = jest.fn().mockReturnValue(LOGFORM_FORMAT);

        formatUnbound
          .apply(null, [{ combine, timestamp, label, printf, prettyPrint, json }])
          .apply(null, [CONFIG]);
      });

      it(`Should set exact label`, () => {
        expect(label)
          .toHaveBeenCalledTimes(1);
        expect(label)
          .toHaveBeenCalledWith({ label: `[${CONFIG.label}]` });
      });

      it(`Should set pretty print format`, () => {
        expect(prettyPrint)
          .toHaveBeenCalledTimes(1);
        expect(prettyPrint)
          .toHaveBeenCalledWith();
      });

      it(`Should set timestamp`, () => {
        expect(timestamp)
          .toHaveBeenCalledTimes(1);
        expect(timestamp)
          .toHaveBeenCalledWith();
      });

      it(`Should set json format`, () => {
        expect(json)
          .toHaveBeenCalledTimes(1);
        expect(json)
          .toHaveBeenCalledWith();
      });

      it(`Should set custom print format`, () => {
        expect(printf)
          .toHaveBeenCalledTimes(1);
        expect(printf)
          .toHaveBeenCalledWith(expect.toBeFunction());
      });

      it(`Should combine all formats`, () => {
        expect(combine)
          .toHaveBeenCalledTimes(1);
        expect(combine)
          .toHaveBeenCalledWith(LOGFORM_FORMAT, LOGFORM_FORMAT, LOGFORM_FORMAT, LOGFORM_FORMAT, LOGFORM_FORMAT);
      });
    });
  });
});
