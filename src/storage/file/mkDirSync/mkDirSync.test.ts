import mkDirSyncUnbound from './mkDirSync.unbound';
import { Either } from 'tsmonad';
import { FSError, FSMKDirOptions, FSPath } from '../file.types';
import { AppError } from 'common/error';

const RECURSIVE: boolean = true;
const DIR_PATH: FSPath = '/user/test';
const OPTIONS: FSMKDirOptions = { recursive: RECURSIVE };
const ERROR_MESSAGE = 'not created..';
const ERROR: FSError = { name: 'fs', message: ERROR_MESSAGE, code: 'code' };

describe(`storage`, () => {
  describe(`fs`, () => {
    describe(`make directory sync`, () => {
      let mkdirSync: jest.Mock<void, [FSPath, FSMKDirOptions]>;
      let result: Either<AppError, void>;

      describe(`Happy path`, () => {
        beforeAll(async () => {
          mkdirSync = jest.fn().mockImplementation((_path: FSPath, _options: FSMKDirOptions): void => null);

          result = await mkDirSyncUnbound
            .apply(null, [mkdirSync])
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
          mkdirSync = jest.fn().mockImplementation((_path: FSPath, _options: FSMKDirOptions): void => {
            throw ERROR;
          });

          result = await mkDirSyncUnbound
            .apply(null, [mkdirSync])
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
