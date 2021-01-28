import registerRouteUnbound from './registerRoute.unbound';
import { Fcn } from 'common/types';
import { ContextCreator, Handler, HandlerDef, ModuleDef } from '../registerRoutes.types';
import { Router, Response, RequestHandler, NextFunction } from 'express';
import { Either, Maybe } from 'tsmonad';
import { AppRequest, ModuleConfig } from 'web/serverModules/types';

const PATH: string = '/demo/example';
const HANDLER: Handler<any> = {
  action: jest.fn().mockResolvedValue(Promise.resolve(Either.right({}))),
  authorization: jest.fn().mockReturnValue(Maybe.nothing())
};
const HANDLER_DEF: HandlerDef<any> = {
  ['get']: HANDLER,
  ['post']: HANDLER
};
const MODULE_DEFINITION: ModuleDef<any> = {
  [PATH]: HANDLER_DEF
};

const MODULE_CONFIG: ModuleConfig<any> = {
  moduleDefinition: MODULE_DEFINITION,
  router: null,
  contextFactory: null
};

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`routes helper`, () => {
      describe(`register route with express`, () => {
        let requestHandlerBuilder: jest.Mock<RequestHandler, [Handler<any>, ContextCreator<any>, jest.Mock<jest.Mock<Response<any>, [any]>, [Response<any>]>]>;
        let requestHandler: Fcn<[AppRequest, Response<any>, NextFunction], Promise<void>>;
        let router: Router = {} as Router;
        beforeAll(() => {
          requestHandler = (_req: AppRequest, _res: Response<any>, next: NextFunction): Promise<void> => Promise.resolve(next());
          requestHandlerBuilder = jest.fn().mockImplementation((_handler: Handler<any>, _contextCreator: ContextCreator<any>, _sendResponse: jest.Mock<jest.Mock<Response<any>, [any]>, [Response<any>]>) => requestHandler);
          router.get = jest.fn().mockImplementation((_path: string, _handler: RequestHandler): Router => router);
          router.post = jest.fn().mockImplementation((_path: string, _handler: RequestHandler): Router => router);

          registerRouteUnbound
            .apply(null, [requestHandlerBuilder])
            .apply(null, [{ ...MODULE_CONFIG, router }, null])
            .apply(null, [PATH]);
        });

        it('Should make all calls with exact parameters', () => {
          expect(requestHandlerBuilder)
            .toHaveBeenCalledTimes(2);
          expect(requestHandlerBuilder)
            .toHaveBeenNthCalledWith(1, HANDLER, null, null);
          expect(requestHandlerBuilder)
            .toHaveBeenNthCalledWith(2, HANDLER, null, null);
          expect(router.get)
            .toHaveBeenCalledTimes(1);
          expect(router.post)
            .toHaveBeenCalledWith(PATH, requestHandler);
        });
      });
    });
  });
});
