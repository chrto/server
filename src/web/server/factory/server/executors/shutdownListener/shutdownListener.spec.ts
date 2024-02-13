import shutdownListenerUnbound from './shutdownListener.unbound';
import { Express, Request, RequestHandler, Response } from 'express';
import { Fcn } from 'common/types';
import { Logger } from 'winston';

type ActionMock = jest.Mock<Promise<void>, []>;

const CORS_MW: RequestHandler = (_req, _res, _next) => null;

describe('Server Factory', () => {
  describe('Shutdown Server registration', () => {
    let logger: Logger = {} as Logger;
    let request: Request = {} as Request;
    let response: Response<string> = {} as Response<string>;
    let setTimeout: jest.Mock<NodeJS.Timeout, [ActionMock, number]>;
    let expressApp: Express = {} as Express;
    let cors: jest.Mock<any, []>;
    let shutdown: ActionMock;
    let restart: ActionMock;
    let listening: jest.Mock<boolean, []>;
    let sendResponse;
    let setStatusCode;

    beforeAll(() => {
      logger.debug = jest.fn().mockImplementation((_message: string): Logger => logger);
      sendResponse = jest.fn().mockImplementation((_body: string): void => null);
      setStatusCode = jest.fn().mockImplementation((_code: number): Response<string> => response);
      response.setHeader = jest.fn().mockImplementation((_name: string, _value: string): void => null);
      response.send = sendResponse;
      response.status = setStatusCode;
      setTimeout = jest.fn().mockImplementation((action: ActionMock, _timeout: number) => {
        action();
      });
      cors = jest.fn().mockReturnValue(CORS_MW);
      expressApp.use = jest.fn().mockReturnValue(expressApp);

      shutdown = jest.fn().mockResolvedValue(null);
      restart = jest.fn().mockResolvedValue(null);
    });

    describe(`Register middlewares`, () => {
      beforeAll(() => {
        jest.clearAllMocks();
        expressApp.get = jest.fn().mockReturnValue(expressApp);

        shutdownListenerUnbound
          .apply(null, [logger, setTimeout, cors])
          .apply(null, [expressApp])
          .apply(null, [shutdown, restart, listening]);
      });

      it('Should register cors middleware', () => {
        expect(expressApp.use)
          .toHaveBeenCalledTimes(1);
        expect(cors)
          .toHaveBeenCalledTimes(1);
        expect(expressApp.use)
          .toHaveBeenCalledWith(CORS_MW);
      });

      it('Should register two get routes', () => {
        expect(expressApp.get)
          .toHaveBeenCalledTimes(2);
        expect(expressApp.get)
          .toHaveBeenNthCalledWith(1, '/shutdown', expect.toBeFunction());
        expect(expressApp.get)
          .toHaveBeenNthCalledWith(2, '/restart', expect.toBeFunction());
      });
    });

    describe(`Register middleware - '/shutdown'`, () => {
      beforeAll(() => {
        expressApp.get = jest.fn().mockImplementation((path: string, handler: Fcn<[Request, Response<string>], void>): Express => {
          if (path === '/shutdown') {
            handler(request, response);
          }
          return expressApp;
        });

      });
      describe('http server has been started', () => {
        beforeAll(() => {
          jest.clearAllMocks();
          listening = jest.fn().mockReturnValue(true);

          shutdownListenerUnbound
            .apply(null, [logger, setTimeout, cors])
            .apply(null, [expressApp])
            .apply(null, [shutdown, restart, listening]);
        });

        it(`Should check if server is listening`, () => {
          expect(listening)
            .toHaveBeenCalledTimes(1);
          expect(listening)
            .toHaveBeenCalledWith();
          expect(listening())
            .toBe(true)();
        });

        it(`Should log exact message, if server is listening`, () => {
          expect(logger.debug)
            .toHaveBeenCalledTimes(1);
          expect(logger.debug)
            .toHaveBeenCalledWith('shuting down server..');
          expect(logger.debug)
            .toHaveBeenCalledAfter(listening);
        });

        it(`Should add exact response header`, () => {
          expect(response.setHeader)
            .toHaveBeenCalledTimes(1);
          expect(response.setHeader)
            .toHaveBeenCalledWith('Connection', 'close');
        });

        it(`Should send exact response, after header has been added`, () => {
          expect(sendResponse)
            .toHaveBeenCalledTimes(1);
          expect(sendResponse)
            .toHaveBeenCalledWith('ok');
        });

        it(`Should shutdown application, after response has been sent`, () => {
          expect(setTimeout)
            .toHaveBeenCalledTimes(1);
          expect(setTimeout)
            .toHaveBeenCalledWith(shutdown, 0);
          expect(shutdown)
            .toHaveBeenCalledTimes(1);
          expect(shutdown)
            .toHaveBeenCalledWith();
        });
      });

      describe('http server has not been started', () => {
        beforeAll(() => {
          jest.clearAllMocks();
          listening = jest.fn().mockReturnValue(false);

          shutdownListenerUnbound
            .apply(null, [logger, setTimeout, cors])
            .apply(null, [expressApp])
            .apply(null, [shutdown, restart, listening]);
        });

        it(`Should check if server is listening`, () => {
          expect(listening)
            .toHaveBeenCalledTimes(1);
          expect(listening)
            .toHaveBeenCalledWith();
          expect(listening())
            .toBe(false)();
        });

        it(`Should log exact message, if server is listening`, () => {
          expect(logger.debug)
            .toHaveBeenCalledTimes(1);
          expect(logger.debug)
            .toHaveBeenCalledWith('server is not listening..');
          expect(logger.debug)
            .toHaveBeenCalledAfter(listening);
        });

        it(`Should send exact response, after status has been set to code 409`, () => {
          expect(setStatusCode)
            .toHaveBeenCalledTimes(1);
          expect(setStatusCode)
            .toHaveBeenCalledWith(409);

          expect(sendResponse)
            .toHaveBeenCalledTimes(1);
          expect(sendResponse)
            .toHaveBeenCalledWith({ message: 'conflict', details: 'server is not listening..' });

          expect(setStatusCode)
            .toHaveBeenCalledBefore(sendResponse);
        });
      });
    });
  });
});
