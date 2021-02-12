import axiosUnbound from './axios.unbound';
import { expect as expectChai } from 'chai';
import { AxiosStorage } from './axios.types';
import { AxiosInstance } from 'axios';

const AXIOS: AxiosInstance = {} as AxiosInstance;

describe(`storage`, () => {
  describe(`http storage`, () => {
    describe(`axios`, () => {
      let storage: AxiosStorage;
      beforeAll(() => {
        storage = axiosUnbound
          .apply(null, [AXIOS]);
      });
      it('Should build axios storage object', () => {
        expectChai(storage)
          .to.be.an({}.constructor.name);
        expectChai(storage)
          .which.haveOwnProperty('getRequest');
        expectChai(storage)
          .which.haveOwnProperty('postRequest');
        expectChai(storage)
          .which.haveOwnProperty('patchRequest');
        expectChai(storage)
          .which.haveOwnProperty('putRequest');
        expectChai(storage)
          .which.haveOwnProperty('deleteRequest');
      });
    });
  });
});
