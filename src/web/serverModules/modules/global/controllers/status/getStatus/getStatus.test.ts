import getStatusUnbound from './getStatus.unbound';
import checkDbConnection from './check/dbConnection/checkDbConnection';
import checkService from './check/service/checkService';
import checkAllSystemsWorking from './check/allSystemsWorking/checkAllSystemsWorking';
import doer from 'utils/monad/either/do/doer';

import { Either } from 'tsmonad';
import { Response } from 'express';
import { AppError } from 'common/error';
import { DatabaseState, ServerStatus, ServiceItem } from 'model/global/serverStatus/serverStatus.types';
import { AppRequest } from 'web/serverModules/types';
import { Context } from '../../../context/context.types';
import { AsyncStartStop } from 'model/sequelize/modelFactory/modelFactory.types';
import { ServicePing } from './check/service/checkService.types';

const REQ: AppRequest = {} as AppRequest;
const RES: Response = {} as Response;
const CTX: Context = {};

const SERVER_STATUS: ServerStatus = Object.freeze({
  buildNumber: '',
  version: '1.0.1',
  host: 'test',
  db: DatabaseState.Down,
  services: {},
  allSystemsWorking: false
});

const callCTRL = (service: ServicePing, sdkStartStop: Partial<AsyncStartStop>) =>
  getStatusUnbound
    .apply(null, [checkDbConnection, checkService, checkAllSystemsWorking])
    .apply(null, [SERVER_STATUS])
    .apply(null, [service, sdkStartStop])
    .apply(null, [CTX, REQ, RES]);

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Global', () => {
      describe('controller', () => {
        describe('status', () => {
          describe('get status controller', () => {
            let sdkStart: jest.Mock<Promise<void>, []>;
            let ping: jest.Mock<Promise<Either<AppError, boolean>>>;

            describe('Happy path', () => {
              beforeAll(() => {
                jest.clearAllMocks();
                ping = jest.fn().mockResolvedValue(Either.right(true));
                sdkStart = jest.fn().mockResolvedValue(null);
              });

              it('Should return exact ServerStatus object', () => {
                callCTRL({ ping }, { start: sdkStart })
                  .then(doer({
                    right: (serverStatus: ServerStatus) => {
                      expect(serverStatus).toBeObject;
                      expect(serverStatus).toStrictEqual({ ...SERVER_STATUS, db: DatabaseState.Up, services: { [ServiceItem.sso]: true }, allSystemsWorking: true });
                    }
                  }));
              });
            });

            describe('Error path', () => {
              describe('service error', () => {
                beforeAll(async () => {
                  jest.clearAllMocks();
                  ping = jest.fn().mockResolvedValue(Either.left({}));
                  sdkStart = jest.fn().mockResolvedValue(null);
                });

                it('Should return exact ServerStatus object', () => {
                  callCTRL({ ping }, { start: sdkStart })
                    .then(doer({
                      right: (serverStatus: ServerStatus) => {
                        expect(serverStatus).toBeObject;
                        expect(serverStatus).toStrictEqual({ ...SERVER_STATUS, db: DatabaseState.Up, services: { [ServiceItem.sso]: false }, allSystemsWorking: false });
                      }
                    }));
                });
              });

              describe('DB Connection error', () => {
                beforeAll(async () => {
                  jest.clearAllMocks();
                  ping = jest.fn().mockResolvedValue(Either.right(true));
                  sdkStart = jest.fn().mockRejectedValue(null);
                });

                it('Should return exact ServerStatus object', () => {
                  callCTRL({ ping }, { start: sdkStart })
                    .then(doer({
                      right: (serverStatus: ServerStatus) => {
                        expect(serverStatus).toBeObject;
                        expect(serverStatus).toStrictEqual({ ...SERVER_STATUS, db: DatabaseState.Down, services: { [ServiceItem.sso]: true }, allSystemsWorking: false });
                      }
                    }));
                });
              });
            });
          });
        });
      });
    });
  });
});
