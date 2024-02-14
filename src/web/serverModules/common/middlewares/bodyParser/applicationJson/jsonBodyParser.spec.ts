import jsonBodyParserUnbound from './jsonBodyParser.unbound';
import { NextFunction, RequestHandler, Response } from 'express';
import { OptionsJson } from 'body-parser';
import { AppRequest } from 'web/serverModules/types';
import { MiddlewareFactory } from '../../middlewares.types';

const REQUEST_HANDLER: RequestHandler = (_req: AppRequest, _res: Response, _next: NextFunction) => null;
const OPTIONS_JSON: OptionsJson = { limit: 1024 };

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`middlewares`, () => {
      describe(`request body parer`, () => {
        describe(`json`, () => {
          let jsonBodyParser: jest.Mock<MiddlewareFactory<OptionsJson, RequestHandler>>;
          let result: RequestHandler;

          beforeAll(() => {
            jsonBodyParser = jest.fn().mockReturnValue(REQUEST_HANDLER);

            result = jsonBodyParserUnbound
              .apply(null, [jsonBodyParser])
              .apply(null, [OPTIONS_JSON]);
          });

          it(`Should call jsonBodyParser with exact options`, () => {
            expect(jsonBodyParser).toHaveBeenCalledTimes(1);
            expect(jsonBodyParser).toHaveBeenCalledWith(OPTIONS_JSON);
          });

          it(`Should return middleware function 'RequestHandler'`, () => {
            expect(result).toBeFunction;
            expect(result).toEqual(REQUEST_HANDLER);
          });
        });
      });
    });
  });
});
