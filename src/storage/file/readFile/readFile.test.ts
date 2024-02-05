import readFileUnbound from './readFile.unbound';
import { FSCallback } from '../common/callback/callback.types';
import { FSError, FSPath } from '../file.types';
import callback from '../common/callback/callback';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';

const DEFAUTL_ENCODING = 'utf8';

const FILE_PATH: FSPath = '/user/joe.doe/demo';
const OPTIONS: string = DEFAUTL_ENCODING;
const CONTENT: string = 'file content..';
const ERROR_MESSAGE = 'File not found..';
const ERROR: FSError = { name: 'fs', message: ERROR_MESSAGE, code: 'code' };

describe(`storage`, () => {
  describe(`fs`, () => {
    describe(`read file`, () => {
      let readFile: jest.Mock<void, [FSPath, string, FSCallback<string>]>;
      let result: Either<AppError, string>;

      describe(`Happy path`, () => {
        beforeAll(async () => {
          readFile = jest.fn().mockImplementation((_path: FSPath, _options: string, callback: FSCallback<string>) => {
            callback(null, CONTENT);
          });

          result = await readFileUnbound
            .apply(null, [readFile, callback])
            .apply(null, [FILE_PATH, OPTIONS]);
        });

        it(`Should resolve Either with exact content in right side`, () => {
          result.do({
            right: (content: string): void => {
              expect(typeof content).toBe(''.constructor.name);
              expect(content).toBe(CONTENT);
            },
            left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
          });
        });
      });

      describe(`Error path`, () => {
        beforeAll(async () => {
          readFile = jest.fn().mockImplementation((_path: FSPath, _options: string, callback: FSCallback<string>) => {
            callback(ERROR, null);
          });

          result = await readFileUnbound
            .apply(null, [readFile, callback])
            .apply(null, [FILE_PATH, OPTIONS]);
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
