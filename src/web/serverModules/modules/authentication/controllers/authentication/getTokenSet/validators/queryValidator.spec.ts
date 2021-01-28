import validator from './queryValidator';
import { assert as assertChai, expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import { InvalidInput } from 'common/httpErrors';
import { TokenQueryParams } from '../getTokenSet.types';

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Authentication', () => {
      describe('controller', () => {
        describe('authentication', () => {
          describe('token request query validator', () => {
            it(`should return either with TokenQueryParams object in right side, if everithing pass well`, () => {
              const params: TokenQueryParams = { auth_code: 'auth_code..' };
              validator(params)
                .do({
                  right: (params: TokenQueryParams) => {
                    expectChai(params)
                      .to.be.an('object')
                      .which.is.deep.equal(params);
                  },
                  left: (error: AppError) => assertChai
                    .fail(null, null, 'Left side was not expected.' + '\n' + error.code + '\n' + error.message)
                });
            });

            it(`Should have mandatory query parameter 'auth_code'`, () => {
              validator({} as TokenQueryParams)
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

            it(`Should not be empty 'auth_code'`, () => {
              validator({ auth_code: null })
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
