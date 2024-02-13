import registerMiddlewares from './registerMiddlewares';
import { Middleware } from 'web/serverModules/common/middlewares/middlewares.types';
import { ModuleConfig } from 'web/serverModules/types';

const MW_01: Middleware = null;
const MW_02: Middleware = null;
const MIDDLEWARES: Middleware[] = [MW_01, MW_02];

describe(`Test 'web' module`, () => {
  describe(`modules`, () => {
    describe(`configuration`, () => {
      describe(`middlewares`, () => {
        let moduleConfig: ModuleConfig<any> = {
          router: {}
        } as ModuleConfig<any>;
        let result: ModuleConfig<any>;

        beforeAll(() => {
          jest.clearAllMocks();
          moduleConfig.router.use = jest.fn().mockReturnThis();

          result = registerMiddlewares
            .apply(null, [MIDDLEWARES])
            .apply(null, [moduleConfig]);
        });

        describe(`Happy Paty`, () => {
          it(`Should register all middlewares, which are specified in 'middlewares' list`, () => {
            expect(moduleConfig.router.use).toHaveBeenCalledTimes(1);
            expect(moduleConfig.router.use).toHaveBeenCalledWith(MIDDLEWARES);
          });

          it(`Should return 'ModuleConfig' object , if everything has been executed successfully`, () => {
            expect(result).toBeObject;
            expect(result).toStrictEqual(moduleConfig);
          });
        });

        describe(`Error Path`, () => {
          const ERROR_MESSAGE = 'Middleware has not been registered!';
          let error: Error;
          beforeAll(() => {
            jest.clearAllMocks();
            moduleConfig.router.use = jest.fn().mockImplementation((_mc: ModuleConfig<any>) => {
              throw new Error(ERROR_MESSAGE);
            });

            try {
              result = registerMiddlewares
                .apply(null, [MIDDLEWARES])
                .apply(null, [moduleConfig]);
            } catch (e) {
              error = e;
            }
          });

          it(`Should throw exact error, if error has been thrown`, () => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toEqual(ERROR_MESSAGE);
          });
        });
      });
    });
  });
});
