// import getRequestHandlerUnbound from './requestHandler.unbound';
// import { Logger } from 'winston';
// import { Either, Maybe } from 'tsmonad';
// import { ContextCreator, Handler } from '../../registerRoutes.types';
// import { RequestHandler, Response } from 'express';
// import { AppError } from 'common/error';
// import { AppRequest } from 'web/serverModules/types';
// import { InternalServerError, NotAuthorized } from 'common/httpErrors';

const CONTEXT: any = {};
const ACTION_RESULT: any = { email: 'joe.doe@company.com' };

describe(`Test 'web' module`, () => {
  it.todo('Temporary out of tests');
  // describe(`common`, () => {
  //   describe(`routes`, () => {
  //     describe(`create route request handler`, () => {
  //       let logger: Logger = {} as Logger;
  //       let response: Response = {} as Response;
  //       let request: AppRequest = {} as AppRequest;
  //       let action: jest.Mock<Promise<Either<AppError, any>>, [any, AppRequest, Response]>;
  //       let authorization: jest.Mock<Maybe<string>, [any]>;
  //       let nextFcn: jest.Mock<void, [any]>;
  //       let contextCreator: jest.Mock<any, [AppRequest]>;
  //       let sendResponse: jest.Mock<jest.Mock<Response, [any]>, [Response]>;
  //       let getRequestHandler: jest.Mock<RequestHandler, [Handler<any>, ContextCreator<any>, jest.Mock<jest.Mock<Response<any>, [any]>, [Response<any>]>]>;
  //       let requestHandler: RequestHandler;

  //       beforeAll(() => {
  //         logger.error = jest.fn().mockImplementation((_message: string): Logger => logger);
  //         response.send = jest.fn().mockImplementation((_body: any): Response => response);
  //         request.path = '/demo/example';
  //         nextFcn = jest.fn().mockReturnValue(null);
  //         contextCreator = jest.fn().mockImplementation((_req: AppRequest): any => CONTEXT);
  //         sendResponse = jest.fn().mockImplementation((res: Response) => (body: any): Response => res.send(body));
  //         getRequestHandler = getRequestHandlerUnbound.apply(null, [logger]);
  //       });

  //       beforeEach(() => {
  //         jest.clearAllMocks();
  //       });

  //       describe('Authorized cases', () => {
  //         beforeAll(() => {
  //           authorization = jest.fn().mockImplementation((_context: any): Maybe<string> => Maybe.nothing());
  //         });
  //         describe('Happy path', () => {
  //           beforeAll(() => {
  //             action = jest.fn().mockImplementation((_context: any, _req: AppRequest, _res: Response): Promise<Either<AppError, any>> => Promise.resolve(Either.right<AppError, any>(ACTION_RESULT)));
  //             requestHandler = getRequestHandler({ action, authorization }, contextCreator, sendResponse);
  //           });

  //           it('Should make all calls with exact order and parameters', () => {
  //             requestHandler(request, response, nextFcn)
  //               .then(() => {
  //                 expect(contextCreator)
  //                   .toHaveBeenCalledWith(request);
  //                 expect(authorization)
  //                   .toHaveBeenCalledWith(CONTEXT);
  //                 expect(contextCreator)
  //                   .toHaveBeenCalledBefore(authorization);
  //                 expect(action)
  //                   .toHaveBeenCalledWith(CONTEXT, request, response);
  //                 expect(authorization)
  //                   .toHaveBeenCalledBefore(action);
  //                 expect(sendResponse)
  //                   .toHaveBeenCalledWith(response);
  //                 expect(action)
  //                   .toHaveBeenCalledBefore(sendResponse);
  //                 expect(response.send)
  //                   .toHaveBeenCalledWith(ACTION_RESULT);
  //                 expect(nextFcn)
  //                   .toHaveBeenCalledWith();
  //                 expect(sendResponse)
  //                   .toHaveBeenCalledBefore(nextFcn);
  //                 expect(logger.error)
  //                   .not.toHaveBeenCalled();
  //               });
  //           });
  //         });

  //         describe('Error path', () => {
  //           const error: InternalServerError = new InternalServerError();
  //           beforeAll(() => {
  //             action = jest.fn().mockImplementation((_context: any, _req: AppRequest, _res: Response): Promise<Either<AppError, any>> => Promise.resolve(Either.left<AppError, any>(error)));
  //             requestHandler = getRequestHandler({ action, authorization }, contextCreator, sendResponse);
  //           });

  //           it('Should make all calls with exact order and parameters', () => {
  //             requestHandler(request, response, nextFcn)
  //               .then(() => {
  //                 // ...
  //                 expect(sendResponse)
  //                   .not.toHaveBeenCalled();
  //                 expect(logger.error)
  //                   .toHaveBeenCalledWith(`error while handling request ${request.path}: ${JSON.stringify(error)}`);
  //                 expect(nextFcn)
  //                   .toHaveBeenCalledWith(error);
  //                 expect(logger.error)
  //                   .toHaveBeenCalledBefore(nextFcn);
  //               });
  //           });
  //         });
  //       });

  //       describe('Unauthorized case', () => {
  //         const errMessage: string = 'Only an administator is authorized to fulfill this action';
  //         const notAuthorized: NotAuthorized = new NotAuthorized(errMessage);
  //         beforeAll(() => {
  //           authorization = jest.fn().mockImplementation((_context: any): Maybe<string> => Maybe.just(errMessage));
  //           requestHandler = getRequestHandler({ action, authorization }, contextCreator, sendResponse);
  //         });
  //         it('Should make all calls with exact order and parameters', () => {
  //           requestHandler(request, response, nextFcn)
  //             .then(() => {
  //               // ...
  //               expect(action)
  //                 .not.toHaveBeenCalled();
  //               expect(logger.error)
  //                 .toHaveBeenCalledWith(`error while handling request ${request.path}: ${JSON.stringify(notAuthorized)}`);
  //               expect(nextFcn)
  //                 .toHaveBeenCalledWith(notAuthorized);
  //             });
  //         });
  //       });
  //     });
  //   });
  // });
});
