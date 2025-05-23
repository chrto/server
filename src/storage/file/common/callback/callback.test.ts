import callbackUnbound from './callback.unbound';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { isMissing } from 'utils/validation';
import { FSError } from 'storage/file/file.types';

describe(`storage`, () => {
  describe(`fs`, () => {
    describe(`callback`, () => {
      let result: Either<AppError, string>;

      describe(`Happy path`, () => {
        describe(`Has content`, () => {
          const ERROR: FSError = null;
          const CONTENT: string = 'file content here..';
          beforeAll(async () => {
            result = await new Promise((resolve) => {
              callbackUnbound
                .apply(null, [isMissing])
                .apply(null, [resolve])
                .apply(null, [ERROR, CONTENT]);

            });
          });
          it(`Should resolve Either with content in right side`, () => {
            result.do({
              right: (content: string): void => {
                expect(content).toBeString;
                expect(content).toEqual(CONTENT);
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });

        });

        describe(`Has not content`, () => {
          const ERROR: FSError = null;
          beforeAll(async () => {
            result = await new Promise((resolve) => {
              callbackUnbound
                .apply(null, [isMissing])
                .apply(null, [resolve])
                .apply(null, [ERROR]);

            });
          });
          it(`Should resolve Either with content in right side`, () => {
            result.do({
              right: (content): void => {
                expect(content).toBeNull;
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });

        });
      });

      describe(`Error path`, () => {
        const ERROR_MESSAGE = 'File not found..';
        const ERROR: FSError = { name: 'fs', message: ERROR_MESSAGE, code: 'code' };
        const CONTENT: string = null;
        beforeAll(async () => {
          result = await new Promise((resolve) => {
            callbackUnbound
              .apply(null, [isMissing])
              .apply(null, [resolve])
              .apply(null, [ERROR, CONTENT]);

          });
        });
        it(`Should resolve Either with exact error in left side`, () => {
          result.do({
            right: (): void => fail(`Right side has not been expected`),
            left: (error: AppError) => {
              expect(error).toBeInstanceOf(AppError);
              expect(error.message).toEqual(ERROR_MESSAGE);
            }
          });
        });
      });
    });
  });
});
