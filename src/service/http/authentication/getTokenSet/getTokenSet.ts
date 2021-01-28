import sendAxiosRequest from './../../common/axios/sendRequest/sendRequest';
import createPostConfig from '../../common/axios/requestConfig/postConfig/postConfig';
import sanitizeResponse from '../../common/axios/sanitizeResponse/sanitizeResponse';
import setBody from '../../common/axios/requestConfig/configItems/body/body';
import tokenSetFactory from 'model/authentication/tokenSet';
import { lift } from 'utils/either';
import { Either } from 'tsmonad';
import { AxiosInstance } from 'axios';
import { AppError } from 'common/error';
import { TokenQueryParams } from 'web/serverModules/modules/authentication/controllers/authentication/getTokenSet/getTokenSet.types';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { AuthGrantType, TokenGetReqData, TokenSet } from '../types';
import { HEADER_CONTENT_TYPE } from '../../common/axios/types';
import { TokenSet as TokenSetModel } from 'model/authentication/tokenSet.types';

export default (instance: AxiosInstance, ssoConfig: ISSOConfig) =>
  ({ auth_code }: TokenQueryParams): Promise<Either<AppError, TokenSetModel>> =>
    Promise.resolve(createPostConfig(ssoConfig.ssoTokenEndpoint))
      .then(setBody<TokenGetReqData>({
        code: auth_code,
        grant_type: AuthGrantType.AUTHORIZATON_CODE,
        client_id: ssoConfig.ssoClientId,
        redirect_uri: ssoConfig.ssoRedirectUri,
        client_secret: ssoConfig.ssoClientSecret
      }, HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED))
      .then(sendAxiosRequest<TokenSet>(instance))
      .then(lift(sanitizeResponse))
      .then(lift(tokenSetFactory));
