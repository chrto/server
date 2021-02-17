import readFileUnbound from './readFile.unbound';
import { Either } from 'tsmonad';
import { FSCallback, FSCallbackFactory, FSPromiseResolve } from '../common/callback/callback.types';
import { FSError, FSPath } from '../file.types';

const DEFAUTL_ENCODING = 'utf8';

const FILE_PATH: FSPath = '/user/joe.doe/demo';
const OPTIONS: string = DEFAUTL_ENCODING;
const CONTENT: string = 'file content..';

describe(`storage`, () => {
  describe(`fs`, () => {
    describe(`read file`, () => {
      let readFile: jest.Mock<void, [FSPath, string, FSCallback<string>]>;
      let cbFactory: jest.Mock<FSCallbackFactory<string>>;

      beforeAll(async () => {
        readFile = jest.fn().mockImplementation((_path: FSPath, _options: string, callback: FSCallback<string>) => {
          callback(null, CONTENT);
        });
        cbFactory = jest.fn().mockImplementation((resolve: FSPromiseResolve<string>) =>
          (error: FSError, content: string) => !!error ? resolve(Either.left(error)) : resolve(Either.right(content)));

        await readFileUnbound
          .apply(null, [readFile, cbFactory])
          .apply(null, [FILE_PATH, OPTIONS]);
      });

      it(`Should read file and execute callback with exact prameters`, () => {
        expect(readFile)
          .toHaveBeenCalledTimes(1);
        expect(readFile)
          .toHaveBeenCalledWith(FILE_PATH, OPTIONS, expect.toBeFunction());

        expect(cbFactory)
          .toHaveBeenCalledTimes(1);
        expect(cbFactory)
          .toHaveBeenCalledWith(expect.toBeFunction());

        expect(readFile)
          .toHaveBeenCalledAfter(cbFactory);

      });
    });
  });
});
