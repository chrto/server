import axiosUnbound from './axios.unbound';
import { AxiosStorage } from './axios.types';
import { AxiosInstance } from 'axios';

const AXIOS: AxiosInstance = {} as AxiosInstance;

describe(`storage`, () => {
  describe(`http`, () => {
    describe(`axios`, () => {
      let storage: AxiosStorage;
      beforeAll(() => {
        storage = axiosUnbound
          .apply(null, [AXIOS]);
      });
      it('Should build axios storage object', () => {
        expect(storage).toBeInstanceOf(Object)
        expect(storage).toHaveProperty('getRequest');
        expect(storage).toHaveProperty('postRequest');
        expect(storage).toHaveProperty('patchRequest');
        expect(storage).toHaveProperty('putRequest');
        expect(storage).toHaveProperty('deleteRequest');
      });
    });
  });
});
