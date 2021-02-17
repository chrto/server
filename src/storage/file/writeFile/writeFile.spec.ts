import writeFileUnbound from './writeFile.unbound';
import { Either } from 'tsmonad';
import { FSCallback, FSCallbackFactory, FSPromiseResolve } from '../common/callback/callback.types';
import { FSError, FSPath, FSWriteOptions } from '../file.types';

const DEFAUTL_ENCODING = 'utf8';
const FILE_PATH: FSPath = '/user/joe.doe/demo';
const OPTIONS: FSWriteOptions = { encoding: DEFAUTL_ENCODING };
const DATA: string = 'file content..';

describe(`storage`, () => {
  describe(`fs`, () => {
    describe(`write file`, () => {
      let writeFile: jest.Mock<void, [FSPath, string, FSWriteOptions, FSCallback<void>]>;
      let cbFactory: jest.Mock<FSCallbackFactory<void>>;

      beforeAll(async () => {
        writeFile = jest.fn().mockImplementation((_path: FSPath, _data: any, _options: FSWriteOptions, callback: FSCallback<void>) => {
          callback(null);
        });
        cbFactory = jest.fn().mockImplementation((resolve: FSPromiseResolve<void>) =>
          (error: FSError) => !!error ? resolve(Either.left(error)) : resolve(Either.right(null)));

        await writeFileUnbound
          .apply(null, [writeFile, cbFactory])
          .apply(null, [FILE_PATH, DATA, OPTIONS]);
      });

      it(`Should read file and execute callback with exact prameters`, () => {
        expect(writeFile)
          .toHaveBeenCalledTimes(1);
        expect(writeFile)
          .toHaveBeenCalledWith(FILE_PATH, DATA, OPTIONS, expect.toBeFunction());

        expect(cbFactory)
          .toHaveBeenCalledTimes(1);
        expect(cbFactory)
          .toHaveBeenCalledWith(expect.toBeFunction());

        expect(writeFile)
          .toHaveBeenCalledAfter(cbFactory);

      });
    });
  });
});
