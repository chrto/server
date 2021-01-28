import { expect as expectChai } from 'chai';
import context from './context';
import { AppRequest } from 'web/serverModules/types';
import { Context } from './context.types';

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Authentication', () => {
      describe('context', () => {
        let request: AppRequest<unknown, unknown, unknown> = {} as AppRequest<unknown, unknown, unknown>;
        let authenticationContext: Context;
        beforeAll(() => {
          authenticationContext = context.apply(null, [request]);
        });
        it(`Should create an object, which has 'Context' interface`, () => {
          expectChai(authenticationContext)
            .to.be.deep.equal({});
        });
      });
    });
  });
});
