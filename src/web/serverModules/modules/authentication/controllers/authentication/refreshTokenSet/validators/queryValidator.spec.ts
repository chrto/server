import validator from './queryValidator';
import { AppError } from 'common/error';
import { InvalidInput } from 'common/httpErrors';
import { TokenRefreshQueryParams } from '../refreshTokenSet.types';

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Authentication', () => {
      describe('controller', () => {
        describe('authentication', () => {
          describe('refresh token request query validator', () => {
            it(`should return either with TokenRefreshQueryParams object in right side, if everithing pass well`, () => {
              const params: TokenRefreshQueryParams = { refresh_token: 'refresh_token..' };
              validator(params)
                .do({
                  right: (result: TokenRefreshQueryParams) => {
                    expect(result).toBeObject;
                    expect(result).toStrictEqual(params);
                  },
                  left: (error: AppError) => fail('Left side was not expected.' + '\n' + error.code + '\n' + error.message)
                });
            });

            it(`Should have mandatory query parameter 'refresh_token'`, () => {
              validator({} as TokenRefreshQueryParams)
                .do({
                  right: () => fail('Error \'InvalidInput\' was expected.'),
                  left: (error: AppError) => {
                    expect(error).toBeInstanceOf(InvalidInput);
                  }
                });
            });

            it(`Should not be empty 'refresh_token'`, () => {
              validator({ refresh_token: null })
                .do({
                  right: () => fail('Error \'InvalidInput\' was expected.'),
                  left: (error: AppError) => {
                    expect(error).toBeInstanceOf(InvalidInput);
                  }
                });
            });
          });
        });
      });
    });
  });
});
