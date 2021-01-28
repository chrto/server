import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { TokenSet as TokenSetModel } from 'model/authentication/tokenSet.types';
import { TokenQueryParams } from 'web/serverModules/modules/authentication/controllers/authentication/getTokenSet/getTokenSet.types';
import { TokenRefreshQueryParams } from 'web/serverModules/modules/authentication/controllers/authentication/refreshTokenSet/refreshTokenSet.types';
import { ParsedUrlQueryInput } from 'querystring';

export interface TokenGetReqData extends ParsedUrlQueryInput {
  code: string;
  grant_type: string;
  client_id: string;
  redirect_uri: string;
  client_secret: string;
}

export interface TokenRefreshReqData extends ParsedUrlQueryInput {
  refresh_token: string;
  grant_type: string;
  client_id: string;
  client_secret: string;
}

export enum AuthGrantType {
  IMPLICIT = 'implicit',
  AUTHORIZATON_CODE = 'authorization_code',
  REFRESH_TOKEN = 'refresh_token',
  CLIENT_CREDENTIALS = 'client_credentials',
  PASSWORD = 'password'
}

export enum AuthBodyItems {
  grant_type = 'grant_type',
  client_id = 'client_id',
  client_secret = 'client_secret',
  scope = 'scope',
  code = 'code',
  redirect_uri = 'redirect_uri',
  refresh_token = 'refresh_token'
}

export interface TokenSet {
  token_type?: string;
  expires_in?: number;
  ext_expires_in?: number;
  id_token?: string;
  access_token?: string;
  refresh_token?: string;
}

export interface AuthenticationService {
  getTokensSet: ({ auth_code }: TokenQueryParams) => Promise<Either<AppError, TokenSetModel>>;
  refreshTokens: ({ refresh_token }: TokenRefreshQueryParams) => Promise<Either<AppError, TokenSetModel>>;
  logOut: (idToken: string) => Promise<Either<AppError, any>>;
  ping: () => Promise<Either<AppError, any>>;
}
