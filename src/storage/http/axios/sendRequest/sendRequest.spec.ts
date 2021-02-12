import sendRequestUnbound from './sendRequest.unbound';
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { AppError } from 'common/error';

type ConfigHandler = jest.Mock<AxiosRequestConfig, [AxiosRequestConfig]>;
const APP_ERROR: AppError = new AppError('error', 'Internal Server Error');
const CONFIG: AxiosRequestConfig = {};
const AXIOS_RESPONSE: AxiosResponse<any> = {
  data: {}
} as AxiosResponse<any>;
const METHOD: Method = 'POST';
const URL: string = 'http://ep.com/api/user';

describe(`storage`, () => {
  describe(`http storage`, () => {
    describe(`axios`, () => {
      describe(`send request`, () => {
        let axiosInstance: AxiosInstance = {} as AxiosInstance;
        let handleAxiosError: jest.Mock<AppError, [AxiosError]>;
        let configHandler: ConfigHandler;
        let setMethod: jest.Mock<ConfigHandler, [Method]>;
        let setUrl: jest.Mock<ConfigHandler, [string]>;

        beforeAll(async () => {
          axiosInstance.request = jest.fn().mockResolvedValue(AXIOS_RESPONSE);
          handleAxiosError = jest.fn().mockReturnValue(APP_ERROR);
          configHandler = jest.fn().mockReturnValue(CONFIG);
          setMethod = jest.fn().mockReturnValue(configHandler);
          setUrl = jest.fn().mockReturnValue(configHandler);

          await sendRequestUnbound
            .apply(null, [handleAxiosError, setMethod, setUrl])
            .apply(null, [axiosInstance])
            .apply(null, [METHOD, URL])
            .apply(null, [CONFIG]);
        });
        it(`Should set exact http method into axios configuration`, () => {
          expect(setMethod)
            .toHaveBeenCalledTimes(1);
          expect(setMethod)
            .toHaveBeenCalledWith(METHOD);
        });

        it(`Should set exact url into axios configuration`, () => {
          expect(setUrl)
            .toHaveBeenCalledTimes(1);
          expect(setUrl)
            .toHaveBeenCalledWith(URL);
        });

        it(`Should send axios request`, () => {
          expect(axiosInstance.request)
            .toHaveBeenCalledTimes(1);
        });

        it(`Should not call error handler, if error has not been rejected`, () => {
          expect(handleAxiosError)
            .toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
