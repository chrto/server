import moduleParamHandler from './moduleParamHandler';
import { Router } from 'express';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { ModuleConfig } from 'web/serverModules/types';
import { ParamHandler, ParamHandlers } from './moduleParamHandler.types';

export enum ModuleParams {
  userId = 'userId'
}

const MODULE_CONFIG: ModuleConfig<any> = {
  moduleDefinition: null,
  router: null,
  contextFactory: null
};

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Portal', () => {
      describe('Configuration', () => {
        describe('Module param handler registration', () => {
          let service: PluginSdkService;
          let router: Router = {} as Router;
          let handlers: ParamHandlers<ModuleParams>;
          let handler: ParamHandler;
          let result: ModuleConfig<any>;

          beforeAll(() => {
            service = {} as PluginSdkService;
            router.param = jest.fn().mockImplementation((_name: string, _handler: ParamHandler): Router => router);
            handler = null;
            MODULE_CONFIG.router = router;
            handlers = {
              userId: jest.fn().mockImplementation((_service: PluginSdkService) => handler)
            };

            result = moduleParamHandler(handlers)(service)(MODULE_CONFIG);

          });
          it(`Should make all calls with exact parameters and set required param handlers`, () => {
            expect(router.param).toHaveBeenCalledTimes(1);
            expect(router.param).toHaveBeenCalledWith('userId', handler);

            expect(handlers.userId).toHaveBeenCalledTimes(1);
            expect(handlers.userId).toHaveBeenCalledWith(service);
          });

          it('Should return ModuleConfig object', () => {
            expect(result).toStrictEqual(MODULE_CONFIG);
          });
        });
      });
    });
  });
});
