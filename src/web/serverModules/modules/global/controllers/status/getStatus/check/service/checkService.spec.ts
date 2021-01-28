import checkService from './checkService';
import { expect as expectChai } from 'chai';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { DatabaseState, ServerStatus, ServiceItem } from 'model/global/serverStatus/serverStatus.types';

const SERVER_STATUS: ServerStatus = Object.freeze({
  buildNumber: '',
  version: '1.0.1',
  host: 'test',
  db: DatabaseState.Down,
  services: {},
  allSystemsWorking: false
});

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Global', () => {
      describe('controller', () => {
        describe('status', () => {
          describe('get status controller', () => {
            describe('check service hleper', () => {
              let result: ServerStatus;
              let ping: jest.Mock<Promise<Either<AppError, boolean>>>;

              describe('Happy path', () => {
                beforeAll(async () => {
                  jest.clearAllMocks();
                  ping = jest.fn().mockResolvedValue(Either.right(true));

                  result = await checkService
                    .apply(null, [{ ping }, ServiceItem.sso])
                    .apply(null, [SERVER_STATUS]);
                });

                it('Should call ping method on service object', () => {
                  expect(ping)
                    .toHaveBeenCalledTimes(1);
                  expect(ping)
                    .toHaveBeenCalledWith();
                });

                it(`Should set exact item in 'services' object to 'true', if ping() has been executed successfully`, () => {
                  expectChai(result.services)
                    .to.be.an('object')
                    .which.haveOwnProperty(ServiceItem.sso)
                    .which.is.equal(true);
                });

                it(`Should keep existing items, after has been executed`, () => {
                  expectChai(result)
                    .to.be.an('object')
                    .which.is.deep.equal({
                      ...SERVER_STATUS,
                      services: {
                        ...SERVER_STATUS.services,
                        [ServiceItem.sso]: true
                      }
                    });
                });
              });

              describe('Error path', () => {
                const appError: AppError = new AppError('app.error', 'Service not available');
                beforeAll(async () => {
                  jest.clearAllMocks();
                  ping = jest.fn().mockResolvedValue(Either.left(appError));

                  result = await checkService
                    .apply(null, [{ ping }, ServiceItem.sso])
                    .apply(null, [SERVER_STATUS]);
                });

                it(`Should set exact item in 'services' object to 'false', if ping() has not been executed successfully`, () => {
                  expectChai(result.services)
                    .to.be.an('object')
                    .which.haveOwnProperty(ServiceItem.sso)
                    .which.is.equal(false);
                });

                it(`Should keep existing items, after has been executed`, () => {
                  expectChai(result)
                    .to.be.an('object')
                    .which.is.deep.equal({
                      ...SERVER_STATUS,
                      services: {
                        ...SERVER_STATUS.services,
                        [ServiceItem.sso]: false
                      }
                    });
                });
              });
            });
          });
        });
      });
    });
  });
});
