import validator from './queryValidator';
import { assert as assertChai, expect as expectChai } from 'chai';
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
                  right: (params: TokenRefreshQueryParams) => {
                    expectChai(params)
                      .to.be.an('object')
                      .which.is.deep.equal(params);
                  },
                  left: (error: AppError) => assertChai
                    .fail(null, null, 'Left side was not expected.' + '\n' + error.code + '\n' + error.message)
                });
            });

            it(`Should have mandatory query parameter 'refresh_token'`, () => {
              validator({} as TokenRefreshQueryParams)
                .do({
                  right: () => assertChai
                    .fail(null, null, 'Error \'InvalidInput\' was expected.'),
                  left: (error: AppError) => {
                    expectChai(error)
                      .to.be.an('error')
                      .that.is.instanceOf(InvalidInput);
                  }
                });
            });

            it(`Should not be empty 'refresh_token'`, () => {
              validator({ refresh_token: null })
                .do({
                  right: () => assertChai
                    .fail(null, null, 'Error \'InvalidInput\' was expected.'),
                  left: (error: AppError) => {
                    expectChai(error)
                      .to.be.an('error')
                      .that.is.instanceOf(InvalidInput);
                  }
                });
            });
          });
        });
      });
    });
  });
});
