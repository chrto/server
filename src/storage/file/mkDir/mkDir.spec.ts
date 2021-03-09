import mkDirUnbound from './mkDir.unbound';
import { Either } from 'tsmonad';
import { FSCallback, FSCallbackFactory, FSPromiseResolve } from '../common/callback/callback.types';
import { FSError, FSMKDirOptions, FSPath } from '../file.types';

const DIR_PATH: FSPath = '/user/test';
const OPTIONS: FSMKDirOptions = { recursive: true };

describe(`storage`, () => {
  describe(`fs`, () => {
    describe(`make directory`, () => {
      let mkdir: jest.Mock<void, [FSPath, FSMKDirOptions, FSCallback<void>]>;
      let cbFactory: jest.Mock<FSCallbackFactory<void>>;

      beforeAll(async () => {
        mkdir = jest.fn().mockImplementation((_path: FSPath, _options: FSMKDirOptions, callback: FSCallback<void>) => {
          callback(null);
        });
        cbFactory = jest.fn().mockImplementation((resolve: FSPromiseResolve<void>) =>
          (error: FSError) => !!error ? resolve(Either.left(error)) : resolve(Either.right(null)));

        await mkDirUnbound
          .apply(null, [mkdir, cbFactory])
          .apply(null, [DIR_PATH, OPTIONS]);
      });

      it(`Should read file and execute callback with exact prameters`, () => {
        expect(mkdir)
          .toHaveBeenCalledTimes(1);
        expect(mkdir)
          .toHaveBeenCalledWith(DIR_PATH, OPTIONS, expect.toBeFunction());

        expect(cbFactory)
          .toHaveBeenCalledTimes(1);
        expect(cbFactory)
          .toHaveBeenCalledWith(expect.toBeFunction());

        expect(mkdir)
          .toHaveBeenCalledAfter(cbFactory);

      });
    });
  });
});
