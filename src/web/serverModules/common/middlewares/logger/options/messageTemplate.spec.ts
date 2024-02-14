import messageTemplate from './messageTemplate';
import { AppRequest } from 'web/serverModules/types';
import { Response } from 'express';

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`middlewares`, () => {
      describe(`logger options`, () => {
        describe(`logger message template`, () => {
          let request: AppRequest<any> = {
            method: 'GET',
            url: '/api/v1/global/status'
          } as AppRequest<any>;
          let response: Response = {
            statusCode: 200
          } as Response;

          it(`Should create exact log message`, () => {
            const req: AppRequest<any> = {
              ...request,
              currentUser: {
                email: 'joe.doe@company.com'
              }
            } as AppRequest<any>;

            expect(messageTemplate(req, response)).toEqual('[joe.doe@company.com] HTTP GET /api/v1/global/status 200');
          });

          it(`Should not log userName, if email does not exists on currentUser object`, () => {
            const req: AppRequest<any> = {
              ...request,
              currentUser: {}
            } as AppRequest<any>;
            expect(messageTemplate(req, response)).toEqual('HTTP GET /api/v1/global/status 200');
          });
          it(`Should not log userName, if currentUser object is not exists`, () => {
            expect(messageTemplate(request, response)).toEqual('HTTP GET /api/v1/global/status 200');
          });

          it(`Should log response time, if 'responseTime' item exists on response object`, () => {
            const res: Response = {
              ...response,
              responseTime: 54
            } as unknown as Response;
            expect(messageTemplate(request, res)).toEqual('HTTP GET /api/v1/global/status 200 54ms');
          });
          it(`Should log response time, if 'responseTime' item exists on response object`, () => {
            const res: Response = {
              ...response,
              responseTime: 54
            } as unknown as Response;
            expect(messageTemplate(request, res)).toEqual('HTTP GET /api/v1/global/status 200 54ms');
          });
        });
      });
    });
  });
});
