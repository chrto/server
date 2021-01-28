import { expect as expectChai } from 'chai';
import context from './context';
import { AppRequest } from 'web/serverModules/types';
import { Context } from './context.types';

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Global', () => {
      describe('context', () => {
        let request: AppRequest<unknown, unknown, unknown> = {} as AppRequest<unknown, unknown, unknown>;
        let globalContext: Context;
        beforeAll(() => {
          globalContext = context.apply(null, [request]);
        });
        it(`Should create an object, which has 'Context' interface`, () => {
          expectChai(globalContext)
            .to.be.deep.equal({});
        });
      });
    });
  });
});
