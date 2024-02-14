import corsUnbound from './cors.unbound';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { MiddlewareFactory } from '../middlewares.types';

const MIDDLEWARE: RequestHandler = (_req: Request, _res: Response, _next: NextFunction): any => null;

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`middlewares`, () => {
      describe(`cors`, () => {
        let cors: jest.Mock<MiddlewareFactory<void, RequestHandler>>;
        let middleware: RequestHandler;
        beforeAll(() => {
          cors = jest.fn().mockReturnValue(MIDDLEWARE);
          middleware = corsUnbound
            .apply(null, [cors]);
        });

        it(`Should call 'cors' function to create cors middleware.`, () => {
          expect(cors).toHaveBeenCalledTimes(1);
          expect(cors).toHaveBeenCalledWith();
        });

        it(`Should return middleware function.`, () => {
          expect(middleware).toBeFunction;
          expect(middleware).toEqual(MIDDLEWARE);
        });
      });
    });
  });
});
