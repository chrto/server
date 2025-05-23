import fileStorage from './file';

describe(`storage`, () => {
  describe(`fs`, () => {
    it(`Should be file system storage object`, () => {
      expect(fileStorage).toBeInstanceOf(Object);
      expect(fileStorage).toHaveProperty('readFileString');
      expect(fileStorage).toHaveProperty('readFileBuffer');
      expect(fileStorage).toHaveProperty('writeFile');
    });
  });
});
