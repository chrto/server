import mkDirSyncUnbound from './mkDirSync.unbound';
import { FSMKDirOptions, FSPath } from '../file.types';

const DIR_PATH: FSPath = '/user/test';
const OPTIONS: FSMKDirOptions = { recursive: true };

describe(`storage`, () => {
  describe(`fs`, () => {
    describe(`make directory sync`, () => {
      let mkdirSync: jest.Mock<void, [FSPath, FSMKDirOptions]>;

      beforeAll(async () => {
        mkdirSync = jest.fn().mockImplementation((_path: FSPath, _options: FSMKDirOptions): void => null);

        await mkDirSyncUnbound
          .apply(null, [mkdirSync])
          .apply(null, [DIR_PATH, OPTIONS]);
      });

      it(`Should read file and execute callback with exact prameters`, () => {
        expect(mkdirSync)
          .toHaveBeenCalledTimes(1);
        expect(mkdirSync)
          .toHaveBeenCalledWith(DIR_PATH, OPTIONS);
      });
    });
  });
});
