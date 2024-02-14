import validator from './queryValidator';
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
                  right: (result: TokenQueryParams) => {
                    expect(result).toBeObject;
                    expect(result).toStrictEqual(params);
                  },
                  left: (error: AppError) => fail('Left side was not expected.' + '\n' + error.code + '\n' + error.message)
                });
            });

            it(`Should have mandatory query parameter 'auth_code'`, () => {
              validator({} as TokenQueryParams)
                .do({
                  right: () => fail('Error \'InvalidInput\' was expected.'),
                  left: (error: AppError) => {
                    expect(error).toBeInstanceOf(InvalidInput);
                  }
                });
            });

            it(`Should not be empty 'auth_code'`, () => {
              validator({ auth_code: null })
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
