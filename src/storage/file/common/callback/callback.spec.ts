import callbackUnbound from './callback.unbound';
import { FSError } from 'storage/file/file.types';
import { Fcn } from 'common/types';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { InternalServerError } from 'common/httpErrors';
import { FSPromiseResolve } from './callback.types';

describe(`storage`, () => {
  describe(`fs`, () => {
    describe(`callback`, () => {
      let isMissing: jest.Mock<boolean, [FSError]>;
      let promiseResolver: jest.Mock<FSPromiseResolve<string>>;
      let callback: Fcn<[FSError, string], void>;

      beforeAll(() => {
        isMissing = jest.fn().mockImplementation((err: FSError): boolean => !err);
        promiseResolver = jest.fn().mockReturnValue(null);

        callback = callbackUnbound
          .apply(null, [isMissing])
          .apply(null, [promiseResolver]);
      });

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it(`Should check, if error has been occurred and resolve Either with content in right side, if no error`, () => {
        const ERROR: FSError = null;
        const CONTENT: string = 'file content here..';
        callback(ERROR, CONTENT);
        expect(isMissing)
          .toHaveBeenCalledTimes(1);
        expect(isMissing)
          .toHaveBeenCalledWith(ERROR);

        expect(promiseResolver)
          .toHaveBeenCalledTimes(1);
        expect(promiseResolver)
          .toHaveBeenCalledWith(Either.right<AppError, string>(CONTENT));

        expect(promiseResolver)
          .toHaveBeenCalledAfter(isMissing);
      });

      it(`Should check, if error has been occurred and resolve Either with exact error in left side, if error`, () => {
        const ERROR: FSError = { name: 'fs', message: 'File not found..' };
        const CONTENT: string = null;
        callback(ERROR, CONTENT);
        expect(isMissing)
          .toHaveBeenCalledTimes(1);
        expect(isMissing)
          .toHaveBeenCalledWith(ERROR);

        expect(promiseResolver)
          .toHaveBeenCalledTimes(1);
        expect(promiseResolver)
          .toHaveBeenCalledWith(Either.left<AppError, string>(new InternalServerError));

        expect(promiseResolver)
          .toHaveBeenCalledAfter(isMissing);
      });
    });
  });
});
