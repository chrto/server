import context from './context';
import { AppRequest } from 'web/serverModules/types';
import { Context } from './context.types';

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Authentication', () => {
      describe('context', () => {
        let request: AppRequest = {} as AppRequest;
        let authenticationContext: Context;
        beforeAll(() => {
          authenticationContext = context.apply(null, [request]);
        });
        it(`Should create an object, which has 'Context' interface`, () => {
          expect(authenticationContext).toBeInstanceOf(Object)
          expect(authenticationContext).toStrictEqual({});
        });
      });
    });
  });
});
