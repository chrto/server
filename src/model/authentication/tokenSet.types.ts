export enum TokenSetItems {
  token_type = 'token_type',
  expires_in = 'expires_in',
  ext_expires_in = 'ext_expires_in',
  id_token = 'id_token',
  access_token = 'access_token',
  refresh_token = 'refresh_token'
}

export interface TokenSet {
  [TokenSetItems.token_type]: string;
  [TokenSetItems.expires_in]: number;
  [TokenSetItems.ext_expires_in]: number;
  [TokenSetItems.id_token]: string;
  [TokenSetItems.access_token]: string;
  [TokenSetItems.refresh_token]: string;
}
