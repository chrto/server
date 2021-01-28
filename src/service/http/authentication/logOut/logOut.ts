import sendAxiosRequest from './../../common/axios/sendRequest/sendRequest';
import sanitizeResponse from '../../common/axios/sanitizeResponse/sanitizeResponse';
import createGetConfig from '../../common/axios/requestConfig/getConfig/getConfig';
import setConfigParams from '../../common/axios/requestConfig/configItems/params/params';
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
