import { assert as assertChai, expect as expectChai } from 'chai';
import { AppRequest } from 'web/serverModules/types';
import { TokenSet as TokenSetModel } from 'model/authentication/tokenSet.types';

import getTokenSet from './getTokenSet';
import { TokenQueryParams } from './getTokenSet.types';
import * as QueryValidator from './validators/queryValidator';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { InternalServerError, InvalidInput } from 'common/httpErrors';

const TOKEN_SET: TokenSetModel = {
  token_type: 'bearer',
  expires_in: 300,
  ext_expires_in: null,
  id_token: 'id_token..',
  access_token: 'access_token..',
  refresh_token: 'refresh_token..'
};

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Authentication', () => {
      describe('controller', () => {
        describe('authentication', () => {
          describe('get token controller', () => {
            let authenticationService: any = {};
            let spiedQueryValidator: jest.SpyInstance<Either<AppError, TokenQueryParams>, [TokenQueryParams]>;
            let tokenSetOrError: Either<AppError, TokenSetModel>;

            beforeAll(async () => {
              authenticationService.getTokensSet = jest.fn().mockResolvedValue(Either.right<AppError, TokenSetModel>(TOKEN_SET));
              spiedQueryValidator = jest.spyOn(QueryValidator, 'default');
            });

            describe('Happy path', () => {
              const REQUEST: AppRequest<unknown, unknown, TokenQueryParams> = {
                query: {
                  auth_code: 'auth_code..'
                }
              } as AppRequest<unknown, unknown, TokenQueryParams>;

              beforeAll(async () => {
                jest.clearAllMocks();

                tokenSetOrError = await getTokenSet
                  .apply(null, [authenticationService])
                  .apply(null, [null, REQUEST, null]);
              });

              it(`Should validate request query parameters`, () => {
                expect(spiedQueryValidator)
                  .toHaveBeenCalledTimes(1);
                expect(spiedQueryValidator)
                  .toHaveBeenCalledWith(REQUEST.query);
              });

              it(`Should call 'authenticationService.getTokensSet', after query has been validated`, () => {
                expect(authenticationService.getTokensSet)
                  .toHaveBeenCalledTimes(1);
                expect(authenticationService.getTokensSet)
                  .toHaveBeenCalledWith(REQUEST.query);
                expect(spiedQueryValidator)
                  .toHaveBeenCalledBefore(authenticationService.getTokensSet);
              });

              it(`Should return either with 'TokenSet' model in right side, after has been executed`, () => {
                tokenSetOrError
                  .do({
                    right: (tokenSet: TokenSetModel) =>
                      expectChai(tokenSet)
                        .to.be.an('object')
                        .which.is.deep.equal(TOKEN_SET),
                    left: (error: AppError) => assertChai
                      .fail(null, null, 'Left side was not expected.' + '\n' + error.code + '\n' + error.message)
                  });
              });
            });

            describe('Error path - service', () => {
              const REQUEST: AppRequest<unknown, unknown, TokenQueryParams> = {
                query: {
                  auth_code: 'auth_code..'
                }
              } as AppRequest<unknown, unknown, TokenQueryParams>;

              beforeAll(async () => {
                jest.clearAllMocks();
                authenticationService.getTokensSet = jest.fn().mockResolvedValue(Either.left<AppError, TokenSetModel>(new InternalServerError()));

                tokenSetOrError = await getTokenSet
                  .apply(null, [authenticationService])
                  .apply(null, [null, REQUEST, null]);
              });

              it(`Should validate request query parameters`, () => {
                expect(spiedQueryValidator)
                  .toHaveBeenCalledTimes(1);
                expect(spiedQueryValidator)
                  .toHaveBeenCalledWith(REQUEST.query);
              });

              it(`Should call 'authenticationService.getTokensSet', after query has been validated`, () => {
                expect(authenticationService.getTokensSet)
                  .toHaveBeenCalledTimes(1);
                expect(authenticationService.getTokensSet)
                  .toHaveBeenCalledWith(REQUEST.query);
                expect(spiedQueryValidator)
                  .toHaveBeenCalledBefore(authenticationService.getTokensSet);
              });

              it(`Should return either with exact error in left side, after service has been failed`, () => {
                tokenSetOrError
                  .do({
                    right: () =>
                      assertChai
                        .fail(null, null, 'Right side was not expected.'),
                    left: (error: AppError) => {
                      expectChai(error)
                        .to.be.instanceOf(InternalServerError);
                      expectChai(error)
                        .to.haveOwnProperty('message')
                        .which.is.equal('Internal Server Error');
                      expectChai(error)
                        .to.haveOwnProperty('code')
                        .which.is.equal('server.error');
                    }
                  });
              });
            });

            describe('Error path - validator', () => {
              const REQUEST: AppRequest<unknown, unknown, TokenQueryParams> = {
                query: {
                  auth_code: null
                }
              } as AppRequest<unknown, unknown, TokenQueryParams>;
              beforeAll(async () => {
                jest.clearAllMocks();

                tokenSetOrError = await getTokenSet
                  .apply(null, [authenticationService])
                  .apply(null, [null, REQUEST, null]);
              });

              it(`Should validate request query parameters`, () => {
                expect(spiedQueryValidator)
                  .toHaveBeenCalledTimes(1);
                expect(spiedQueryValidator)
                  .toHaveBeenCalledWith(REQUEST.query);
              });

              it(`Should NOT call 'authenticationService.getTokensSet', if validator has finished with error`, () => {
                expect(authenticationService.getTokensSet)
                  .toHaveBeenCalledTimes(0);
              });

              it(`Should return either with exact error in left side, after validation has been failed`, () => {
                tokenSetOrError
                  .do({
                    right: () =>
                      assertChai
                        .fail(null, null, 'Right side was not expected.'),
                    left: (error: AppError) => {
                      expectChai(error)
                        .to.be.instanceOf(InvalidInput);
                      expectChai(error)
                        .to.haveOwnProperty('message')
                        .which.is.equal('Validation failed: ["Missing mandatory query parameter: auth_code"]');
                      expectChai(error)
                        .to.haveOwnProperty('code')
                        .which.is.equal('invalid.input');
                    }
                  });
              });
            });
          });
        });
      });
    });
  });
});
