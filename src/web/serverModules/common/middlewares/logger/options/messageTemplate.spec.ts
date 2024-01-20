import messageTemplate from './messageTemplate';
import { AppRequest } from 'web/serverModules/types';
import { Response } from 'express';
import { expect as expectChai } from 'chai';

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

            expectChai(messageTemplate(req, response))
              .to.be.an('string')
              .which.is.equal('[joe.doe@company.com] HTTP GET /api/v1/global/status 200');
          });

          it(`Should not log userName, if email does not exists on currentUser object`, () => {
            const req: AppRequest<any> = {
              ...request,
              currentUser: {}
            } as AppRequest<any>;
            expectChai(messageTemplate(req, response))
              .to.be.an('string')
              .which.is.equal('HTTP GET /api/v1/global/status 200');
          });
          it(`Should not log userName, if currentUser object is not exists`, () => {
            expectChai(messageTemplate(request, response))
              .to.be.an('string')
              .which.is.equal('HTTP GET /api/v1/global/status 200');
          });

          it(`Should log response time, if 'responseTime' item exists on response object`, () => {
            const res: Response = {
              ...response,
              responseTime: 54
            } as unknown as Response;
            expectChai(messageTemplate(request, res))
              .to.be.an('string')
              .which.is.equal('HTTP GET /api/v1/global/status 200 54ms');
          });
          it(`Should log response time, if 'responseTime' item exists on response object`, () => {
            const res: Response = {
              ...response,
              responseTime: 54
            } as unknown as Response;
            expectChai(messageTemplate(request, res))
              .to.be.an('string')
              .which.is.equal('HTTP GET /api/v1/global/status 200 54ms');
          });
        });
      });
    });
  });
});
