import registerRoutesUnbound from './registerRoutes.unbound';
import { expect as expectChai } from 'chai';
import { Fcn } from 'common/types';
import { Router, Response } from 'express';
import { ContextCreator, Handler, HandlerDef, ModuleDef } from './registerRoutes.types';
import { Either, Maybe } from 'tsmonad';
import { ModuleConfig } from 'web/serverModules/types';

type MockRegisterRoute = jest.Mock<void, [string]>;
type MockSendResponse = jest.Mock<jest.Mock<Response, [any]>, [Response]>;

const PATH_1: string = '/demo/example';
const PATH_2: string = '/demo';
const HANDLER: Handler<any> = {
  action: jest.fn().mockResolvedValue(Promise.resolve(Either.right({}))),
  authorization: jest.fn().mockReturnValue(Maybe.nothing())
};
const HANDLER_DEF: HandlerDef<any> = {
  ['get']: HANDLER,
  ['post']: HANDLER
};
const MODULE_DEFINITION: ModuleDef<any> = {
  [PATH_1]: HANDLER_DEF,
  [PATH_2]: HANDLER_DEF
};

const MODULE_CONFIG: ModuleConfig<any> = {
  moduleDefinition: MODULE_DEFINITION,
  router: null,
  contextFactory: null
};

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`routes helper`, () => {
      describe(`register module routes with express`, () => {
        let registerRouteBuilder: jest.Mock<MockRegisterRoute, [ModuleConfig<any>, MockSendResponse]>;
        let registerRoute: MockRegisterRoute;
        let sendResponse: MockSendResponse;
        let result: ModuleConfig<any>;
        beforeEach(() => {
          sendResponse = jest.fn().mockImplementation((res: Response) => (body: any): Response => res.send(body));
          registerRoute = jest.fn().mockImplementation((_path: string, _index: number, _arr: string[]): void => null);
          registerRouteBuilder = jest.fn().mockImplementation(
            (_moduleDef: ModuleDef<any>, _router: Router, _contextCreator: ContextCreator<any>, _send: Fcn<[Response], Fcn<[any], Response<any>>>) => registerRoute
          );

          result = registerRoutesUnbound
            .apply(null, [registerRouteBuilder, sendResponse])
            .apply(null, [MODULE_CONFIG]);
        });

        it('Should make all calls with exact parameters', () => {
          expect(registerRouteBuilder)
            .toHaveBeenCalledWith(MODULE_CONFIG, sendResponse);
          expect(registerRoute)
            .toHaveBeenCalledTimes(2);
          expect(registerRoute)
            .toHaveBeenNthCalledWith(1, PATH_1, 0, Object.keys(MODULE_DEFINITION));
          expect(registerRoute)
            .toHaveBeenNthCalledWith(2, PATH_2, 1, Object.keys(MODULE_DEFINITION));
        });

        it('Should return ModuleConfig object', () => {
          expectChai(result)
            .to.be.deep.equal(MODULE_CONFIG);
        });
      });
    });
  });
});
