import refreshTokensUnbound from './refreshTokens.unbound';
import tokenSetFactory from 'model/authentication/tokenSet';
import axiosStorage from 'storage/http/axios/axios';
import requestConfig from 'storage/http/axios/requestConfig/requestConfig';
import sanitizeResponse from 'storage/http/axios/sanitizeResponse/sanitizeResponse';

export default refreshTokensUnbound.apply(null, [axiosStorage.postRequest, requestConfig, sanitizeResponse, tokenSetFactory]);
