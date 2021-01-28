import authenticationModuleUnbound from './authenticationModule.unbound';
import { expect as expectChai } from 'chai';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { ModuleConfig, ModuleConfigFactory } from 'web/serverModules/types';
import { Context as AuthContext } from './context/context.types';
import { AuthenticationService } from 'service/http/authentication/types';
import { Router } from 'express';
import { Either } from 'tsmonad';
import { Logger } from 'winston';

const AUTH_SERVICE: AuthenticationService = {} as AuthenticationService;
const SERVICE: PluginSdkService = { authenticationService: AUTH_SERVICE } as PluginSdkService;

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Authentication', () => {
      let logger: Logger = {} as Logger;
      let moduleDefinition: jest.Mock<ModuleConfigFactory<AuthContext>, [PluginSdkService]>;
      let setModuleDefinition: jest.Mock<ModuleConfigFactory<AuthContext>, [PluginSdkService]>;
      let moduleMiddlewares: jest.Mock<Either<any, ModuleConfig<AuthContext>>, [ModuleConfig<AuthContext>]>;
      let registerErrorHandlerMiddleware: jest.Mock<Either<any, ModuleConfig<AuthContext>>, [ModuleConfig<AuthContext>]>;
      let registerRoutes: jest.Mock<ModuleConfig<AuthContext>, [ModuleConfig<AuthContext>]>;
      let result: Router;
      let moduleConfig: ModuleConfig<AuthContext> = {
        router: {
          use: null
        } as Router,
        contextFactory: null,
        moduleDefinition: null
      };

      beforeAll(() => {
        jest.clearAllMocks();
        logger.error = jest.fn().mockReturnThis();
        setModuleDefinition = jest.fn().mockImplementation((moduleConfig: ModuleConfig<AuthContext>): ModuleConfig<AuthContext> => moduleConfig);
        moduleDefinition = jest.fn().mockReturnValue(setModuleDefinition);
        moduleMiddlewares = jest.fn().mockImplementation((moduleConfig: ModuleConfig<AuthContext>): ModuleConfig<AuthContext> => moduleConfig);
        registerErrorHandlerMiddleware = jest.fn().mockImplementation((moduleConfig: ModuleConfig<AuthContext>): ModuleConfig<AuthContext> => moduleConfig);
        registerRoutes = jest.fn().mockImplementation((moduleConfig: ModuleConfig<AuthContext>): ModuleConfig<AuthContext> => moduleConfig);

        result = authenticationModuleUnbound
          .apply(null, [logger, moduleDefinition, moduleMiddlewares, registerErrorHandlerMiddleware, registerRoutes])
          .apply(null, [moduleConfig])
          .apply(null, [SERVICE, null]);
      });

      describe('Happy path', () => {
        it(`Should load module definition as first`, () => {
          expect(moduleDefinition)
            .toHaveBeenCalledTimes(1);
          expect(moduleDefinition)
            .toHaveBeenCalledWith(SERVICE);
          expectChai(moduleDefinition(SERVICE))
            .to.be.an('function')
            .which.is.equal(setModuleDefinition);
          expect(setModuleDefinition)
            .toHaveBeenCalledTimes(1);
          expect(setModuleDefinition)
            .toHaveBeenCalledWith(moduleConfig);
        });

        it(`Should register required middlewares, after module definition has been loaded`, () => {
          expect(moduleMiddlewares)
            .toHaveBeenCalledTimes(1);
          expect(moduleMiddlewares)
            .toHaveBeenCalledWith(moduleConfig);
          expect(moduleMiddlewares)
            .toHaveBeenCalledAfter(moduleDefinition);
        });

        it(`Should register routes from module definition object, after middlewares has been registered`, () => {
          expect(registerRoutes)
            .toHaveBeenCalledTimes(1);
          expect(registerRoutes)
            .toHaveBeenCalledWith(moduleConfig);
          expect(registerRoutes)
            .toHaveBeenCalledAfter(moduleMiddlewares);
        });

        it(`Should register error handler middleware, after routes has been registered`, () => {
          expect(registerErrorHandlerMiddleware)
            .toHaveBeenCalledTimes(1);
          expect(registerErrorHandlerMiddleware)
            .toHaveBeenCalledWith(moduleConfig);
          expect(registerErrorHandlerMiddleware)
            .toHaveBeenCalledAfter(registerRoutes);
        });

        it(`Should return router instance, after all required handlers have been registered`, () => {
          expectChai(result)
            .to.be.equal(moduleConfig.router);
        });
      });

      describe('Error path', () => {
        const ERROR_MSG: string = 'Route has not been registered!';
        let result: Error;

        beforeAll(() => {
          jest.clearAllMocks();
          moduleMiddlewares = jest.fn().mockImplementation((_moduleConfig: ModuleConfig<AuthContext>): ModuleConfig<AuthContext> => {
            throw new Error(ERROR_MSG);
          });
          try {
            authenticationModuleUnbound
              .apply(null, [logger, moduleDefinition, moduleMiddlewares, registerErrorHandlerMiddleware, registerRoutes])
              .apply(null, [moduleConfig])
              .apply(null, [SERVICE, null]);
          } catch (e) {
            result = e;
          }
        });

        it('Should interrupt execution, after error has been received', () => {
          expect(moduleDefinition)
            .toHaveBeenCalledTimes(1);
          expect(moduleMiddlewares)
            .toHaveBeenCalledTimes(1);
          expect(registerRoutes)
            .toHaveBeenCalledTimes(0);
        });

        it(`Should log exact error message`, () => {
          expect(logger.error)
            .toHaveBeenCalledTimes(1);
          expect(logger.error)
            .toHaveBeenCalledWith('Error in authentication module loader..');
        });

        it(`Should throw exact error, if any function in chain has been thrown an error.`, () => {
          expectChai(result)
            .to.be.instanceOf(Error);
          expectChai(result.message)
            .to.be.equal(ERROR_MSG);
        });
      });
    });
  });
});
