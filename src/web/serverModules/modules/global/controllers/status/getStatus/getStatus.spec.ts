import getStatusUnbound from './getStatus.unbound';
import caseOf from 'utils/monad/either/caseOf/caseOf';
import { Response } from 'express';
import { AppError } from 'common/error';
import { ServerStatus, ServiceItem } from 'model/global/serverStatus/serverStatus.types';
import { AppRequest } from 'web/serverModules/types';
import { Context } from '../../../context/context.types';
import { Either } from 'tsmonad';
import { AuthenticationService } from 'service/http/authentication/types';
import { ServicePing } from './check/service/checkService.types';

type ExecutorMock = jest.Mock<ServerStatus, [ServerStatus]>;
type ExecutorAsyncMock = jest.Mock<Promise<ServerStatus>, [ServerStatus]>;

const REQ: AppRequest = {} as AppRequest;
const RES: Response = {} as Response;
const CTX: Context = {};
const SERVER_STATUS: ServerStatus = {} as ServerStatus;

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Global', () => {
      describe('controller', () => {
        describe('status', () => {
          describe('get status controller', () => {
            let sdkStart: jest.Mock<Promise<void>, []>;
            let ping: jest.Mock<Promise<Either<AppError, boolean>>>;

            let checkDbConnection: jest.Mock<ExecutorAsyncMock, [jest.Mock<Promise<void>, []>]>;
            let checkService: jest.Mock<ExecutorAsyncMock, [AuthenticationService, ServiceItem]>;
            let checkAllSystemsWorking: jest.Mock<ExecutorMock>;

            beforeAll(async () => {
              sdkStart = jest.fn().mockResolvedValue(null);
              ping = jest.fn().mockResolvedValue(Either.right(true));

              checkDbConnection = jest.fn().mockImplementation((start: jest.Mock<Promise<void>, []>) =>
                (_status: ServerStatus): Promise<ServerStatus> =>
                  start()
                    .then(() => SERVER_STATUS));

              checkService = jest.fn().mockImplementation((service: ServicePing, _item: ServiceItem) =>
                (_status: ServerStatus): Promise<ServerStatus> =>
                  service.ping()
                    .then(caseOf({
                      right: (): ServerStatus => SERVER_STATUS,
                      left: (): ServerStatus => SERVER_STATUS
                    })));

              checkAllSystemsWorking = jest.fn().mockImplementation((_status: ServerStatus) => SERVER_STATUS);

              await getStatusUnbound
                .apply(null, [checkDbConnection, checkService, checkAllSystemsWorking])
                .apply(null, [SERVER_STATUS])
                .apply(null, [{ ping }, { start: sdkStart }])
                .apply(null, [CTX, REQ, RES]);
            });

            it(`Should check, if db connection has been established`, () => {
              expect(checkDbConnection)
                .toHaveBeenCalledTimes(1);
              expect(sdkStart)
                .toHaveBeenCalledTimes(1);
              expect(checkDbConnection)
                .toHaveBeenCalledWith(sdkStart);
            });

            it(`Should check, if service is up, after db connection has been checked`, () => {
              expect(checkService)
                .toHaveBeenCalledTimes(1);
              expect(ping)
                .toHaveBeenCalledTimes(1);
              expect(checkService)
                .toHaveBeenCalledWith({ ping }, ServiceItem.sso);

              expect(checkService)
                .toHaveBeenCalledAfter(checkDbConnection);
            });

            it(`Should check, if all system are up (finally)`, () => {
              expect(checkAllSystemsWorking)
                .toHaveBeenCalledTimes(1);
              expect(checkAllSystemsWorking)
                .toHaveBeenCalledWith(SERVER_STATUS);

              expect(checkAllSystemsWorking)
                .toHaveBeenCalledAfter(checkDbConnection);
              expect(checkAllSystemsWorking)
                .toHaveBeenCalledAfter(checkService);
            });
          });
        });
      });
    });
  });
});
