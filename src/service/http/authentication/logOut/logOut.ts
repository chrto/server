import sendAxiosRequest from 'storage/http/axios/sendRequest/sendRequest';
import sanitizeResponse from 'storage/http/axios/sanitizeResponse/sanitizeResponse';
import createGetConfig from 'storage/http/axios/requestConfig/getConfig/getConfig';
import setConfigParams from 'storage/http/axios/requestConfig/params/params';
import { lift } from 'utils/either';
import { AxiosInstance } from 'axios';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

export default (instance: AxiosInstance, ssoConfig: ISSOConfig) =>
  (idToken: string): Promise<Either<AppError, any>> =>
    Promise.resolve(createGetConfig(ssoConfig.ssoEndSessionEndpoint))
      .then(setConfigParams<any>({ id_token_hint: idToken }))
      .then(sendAxiosRequest<any>(instance))
      .then(lift(sanitizeResponse));
