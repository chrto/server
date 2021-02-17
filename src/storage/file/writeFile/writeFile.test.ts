import writeFileUnbound from './writeFile.unbound';
import { Either } from 'tsmonad';
import { FSCallback } from '../common/callback/callback.types';
import { FSError, FSPath, FSWriteOptions } from '../file.types';
import { AppError } from 'common/error';
import callback from '../common/callback/callback';

const DEFAUTL_ENCODING = 'utf8';
const FILE_PATH: FSPath = '/user/joe.doe/demo';
const OPTIONS: FSWriteOptions = { encoding: DEFAUTL_ENCODING };
const DATA: string = 'file content..';
const ERROR_MESSAGE = 'File not found..';
const ERROR: FSError = { name: 'fs', message: ERROR_MESSAGE, code: 'code' };

describe(`storage`, () => {
  describe(`fs`, () => {
    describe(`write file`, () => {
      let writeFile: jest.Mock<void, [FSPath, string, FSWriteOptions, FSCallback<void>]>;
      let result: Either<AppError, void>;

      describe(`Happy path`, () => {
        beforeAll(async () => {
          writeFile = jest.fn().mockImplementation((_path: FSPath, _data: any, _options: FSWriteOptions, callback: FSCallback<void>) => {
            callback(null);
          });

          result = await writeFileUnbound
            .apply(null, [writeFile, callback])
            .apply(null, [FILE_PATH, DATA, OPTIONS]);
        });

        it(`Should resolve Either with right side`, () => {
          result.do({
            left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
          });
        });
      });

      describe(`Error path`, () => {
        beforeAll(async () => {
          writeFile = jest.fn().mockImplementation((_path: FSPath, _data: any, _options: FSWriteOptions, callback: FSCallback<void>) => {
            callback(ERROR);
          });

          result = await writeFileUnbound
            .apply(null, [writeFile, callback])
            .apply(null, [FILE_PATH, DATA, OPTIONS]);
        });

        it(`Should resolve Either with exact error in left side`, () => {
          result.do({
            right: (): void => fail(`Right side has not been expected`),
            left: (error: AppError) => {
              expect(error)
                .toBeInstanceOf(AppError);
              expect(error.message)
                .toEqual(ERROR_MESSAGE);
            }
          });
        });
      });
    });
  });
});
