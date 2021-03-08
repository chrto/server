import mkDirUnbound from './mkDir.unbound';
import { Either } from 'tsmonad';
import { FSCallback } from '../common/callback/callback.types';
import { FSError, FSMKDirOptions, FSPath } from '../file.types';
import { AppError } from 'common/error';
import callback from '../common/callback/callback';

const RECURSIVE: boolean = true;
const DIR_PATH: FSPath = '/user/test';
const OPTIONS: FSMKDirOptions = { recursive: RECURSIVE };
const ERROR_MESSAGE = 'not created..';
const ERROR: FSError = { name: 'fs', message: ERROR_MESSAGE, code: 'code' };

describe(`storage`, () => {
  describe(`fs`, () => {
    describe(`make directory`, () => {
      let mkdir: jest.Mock<void, [FSPath, FSMKDirOptions, FSCallback<void>]>;
      let result: Either<AppError, void>;

      describe(`Happy path`, () => {
        beforeAll(async () => {
          mkdir = jest.fn().mockImplementation((_path: FSPath, _options: FSMKDirOptions, callback: FSCallback<void>): void => {
            callback(null);
          });

          result = await mkDirUnbound
            .apply(null, [mkdir, callback])
            .apply(null, [DIR_PATH, OPTIONS]);
        });

        it(`Should resolve Either with right side`, () => {
          result.do({
            left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
          });
        });
      });

      describe(`Error path`, () => {
        beforeAll(async () => {
          mkdir = jest.fn().mockImplementation((_path: FSPath, _options: FSMKDirOptions, callback: FSCallback<void>): void => {
            callback(ERROR);
          });

          result = await mkDirUnbound
            .apply(null, [mkdir, callback])
            .apply(null, [DIR_PATH, OPTIONS]);
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
