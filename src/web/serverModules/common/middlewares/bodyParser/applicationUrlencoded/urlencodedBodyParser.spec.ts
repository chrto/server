import urlencodedBodyParserUnbound from './urlencodedBodyParser.unbound';
import { NextFunction, RequestHandler, Response } from 'express';
import { OptionsUrlencoded } from 'body-parser';
import { AppRequest } from 'web/serverModules/types';
import { MiddlewareFactory } from '../../middlewares.types';

const REQUEST_HANDLER: RequestHandler = (_req: AppRequest, _res: Response, _next: NextFunction) => null;
const OPTIONS_URLENCODED: OptionsUrlencoded = { limit: 1024 };

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`middlewares`, () => {
      describe(`request body parer`, () => {
        describe(`urlencoded`, () => {
          let urlencodedBodyParser: jest.Mock<MiddlewareFactory<OptionsUrlencoded, RequestHandler>>;
          let result: RequestHandler;

          beforeAll(() => {
            urlencodedBodyParser = jest.fn().mockReturnValue(REQUEST_HANDLER);

            result = urlencodedBodyParserUnbound
              .apply(null, [urlencodedBodyParser])
              .apply(null, [OPTIONS_URLENCODED]);
          });

          it(`Should call urlencodedBodyParser with exact options`, () => {
            expect(urlencodedBodyParser).toHaveBeenCalledTimes(1);
            expect(urlencodedBodyParser).toHaveBeenCalledWith(OPTIONS_URLENCODED);
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
