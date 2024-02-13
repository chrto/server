import context from './context';
import { AppRequest } from 'web/serverModules/types';
import { Context } from './context.types';

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Global', () => {
      describe('context', () => {
        let request: AppRequest = {} as AppRequest;
        let globalContext: Context;
        beforeAll(() => {
          globalContext = context.apply(null, [request]);
        });
        it(`Should create an object, which has 'Context' interface`, () => {
          expect(globalContext).toBeInstanceOf(Object);
          expect(globalContext).toEqual({})
          expect(globalContext).toStrictEqual({});
        });
      });
    });
  });
});
