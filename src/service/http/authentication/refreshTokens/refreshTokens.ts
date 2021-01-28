import sendAxiosRequest from './../../common/axios/sendRequest/sendRequest';
import createPostConfig from '../../common/axios/requestConfig/postConfig/postConfig';
import setBody from '../../common/axios/requestConfig/configItems/body/body';
import tokenSetFactory from 'model/authentication/tokenSet';
import sanitizeResponse from '../../common/axios/sanitizeResponse/sanitizeResponse';
import { lift } from 'utils/either';
import { AxiosInstance } from 'axios';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { TokenSet as TokenSetModel } from 'model/authentication/tokenSet.types';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { AuthGrantType, TokenRefreshReqData } from '../types';
import { HEADER_CONTENT_TYPE } from '../../common/axios/types';
import { TokenRefreshQueryParams } from 'web/serverModules/modules/authentication/controllers/authentication/refreshTokenSet/refreshTokenSet.types';

export default (instance: AxiosInstance, ssoConfig: ISSOConfig) =>
  ({ refresh_token }: TokenRefreshQueryParams): Promise<Either<AppError, TokenSetModel>> =>
    Promise.resolve(createPostConfig(ssoConfig.ssoTokenEndpoint))
      .then(setBody<TokenRefreshReqData>({
        refresh_token,
        grant_type: AuthGrantType.REFRESH_TOKEN,
        client_id: ssoConfig.ssoClientId,
        client_secret: ssoConfig.ssoClientSecret
      }, HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED))
      .then(sendAxiosRequest<TokenSetModel>(instance))
      .then(lift(sanitizeResponse))
      .then(lift(tokenSetFactory));
