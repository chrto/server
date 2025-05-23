import tokenSetFactory from './tokenSet';
import { TokenSet as TokenSetService } from 'service/http/authentication/types';
import { TokenSet, TokenSetItems } from './tokenSet.types';

describe('Model', () => {
  describe('TokenSet', () => {
    const serviceResponse: TokenSetService = {
      token_type: 'bearer',
      expires_in: 300,
      id_token: 'id_token',
      access_token: 'access_token',
      refresh_token: 'refresh_token'

    };
    it('Should create TokenSet model from service response', () => {
      const expected: TokenSet = {
        [TokenSetItems.token_type]: 'bearer',
        [TokenSetItems.expires_in]: 300,
        [TokenSetItems.ext_expires_in]: undefined,
        [TokenSetItems.id_token]: 'id_token',
        [TokenSetItems.access_token]: 'access_token',
        [TokenSetItems.refresh_token]: 'refresh_token'
      };

      const actual = tokenSetFactory(serviceResponse);
      expect(actual).toBeInstanceOf(Object);
      expect(actual).toStrictEqual(expected);
    });

    it('Should be undefined, if no values', () => {
      const expected: TokenSet = {
        [TokenSetItems.token_type]: undefined,
        [TokenSetItems.expires_in]: undefined,
        [TokenSetItems.ext_expires_in]: undefined,
        [TokenSetItems.id_token]: undefined,
        [TokenSetItems.access_token]: undefined,
        [TokenSetItems.refresh_token]: undefined
      };

      const actual = tokenSetFactory({});
      expect(actual).toBeInstanceOf(Object);
      expect(actual).toStrictEqual(expected);
    });
  });
});
