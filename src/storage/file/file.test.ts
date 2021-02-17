import fileStorage from './file';
import { expect as expectChai } from 'chai';

describe(`storage`, () => {
  describe(`fs`, () => {
    it(`Should be file system storage object`, () => {
      expectChai(fileStorage)
        .to.be.an({}.constructor.name);
      expectChai(fileStorage)
        .to.haveOwnProperty('readFileString');
      expectChai(fileStorage)
        .to.haveOwnProperty('readFileBuffer');
      expectChai(fileStorage)
        .to.haveOwnProperty('writeFile');
    });
  });
});
