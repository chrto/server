import sendAxiosRequest from '../../common/axios/sendRequest/sendRequest';
import createGetConfig from '../../common/axios/requestConfig/getConfig/getConfig';
import sanitizeResponse from '../../common/axios/sanitizeResponse/sanitizeResponse';
import { lift } from 'utils/either';
import { AxiosInstance } from 'axios';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

export default (instance: AxiosInstance, ssoConfig: ISSOConfig) =>
  (): Promise<Either<AppError, any>> =>
    Promise.resolve(createGetConfig(ssoConfig.ssoWellKnown))
      .then(sendAxiosRequest<any>(instance))
      .then(lift(sanitizeResponse));
