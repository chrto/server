import { Algorithm } from 'jsonwebtoken';

export interface ISSOConfig {
  ssoIssuer: string;
  ssoWellKnown: string;
  ssoJwksUri: string;
  ssoTokenEndpoint: string;
  ssoEndSessionEndpoint: string;
  ssoHashAlg: Algorithm;
  ssoClientId: string;
  ssoClientSecret: string;
  ssoRedirectUri: string;
}
