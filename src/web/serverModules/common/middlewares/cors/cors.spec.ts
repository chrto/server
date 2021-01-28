import corsUnbound from './cors.unbound';
import { expect as expectChai } from 'chai';
import { NextFunction, Request, RequestHandler, Response } from 'express';

const MIDDLEWARE: RequestHandler = (_req: Request, _res: Response, _next: NextFunction): any => null;

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`middlewares`, () => {
      describe(`cors`, () => {
        let cors: jest.Mock<RequestHandler, []>;
        let middleware: RequestHandler;
        beforeAll(() => {
          cors = jest.fn().mockReturnValue(MIDDLEWARE);
          middleware = corsUnbound
            .apply(null, [cors]);
        });

        it(`Should call 'cors' function to create cors middleware.`, () => {
          expect(cors)
            .toBeCalledTimes(1);
          expect(cors)
            .toBeCalledWith();
        });

        it(`Should return middleware function.`, () => {
          expectChai(middleware)
            .to.be.an('function')
            .which.is.equal(MIDDLEWARE);
        });
      });
    });
  });
});
