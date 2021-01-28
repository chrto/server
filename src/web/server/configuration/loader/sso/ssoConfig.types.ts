export interface ISSOConfig {
  ssoIssuer: string;
  ssoWellKnown: string;
  ssoJwksUri: string;
  ssoTokenEndpoint: string;
  ssoEndSessionEndpoint: string;
  ssoHashAlg: string;
  ssoClientId: string;
  ssoClientSecret: string;
  ssoRedirectUri: string;
}
