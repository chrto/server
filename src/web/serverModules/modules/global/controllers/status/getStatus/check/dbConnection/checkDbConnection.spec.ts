import checkDbConnection from './checkDbConnection';
import { expect as expectChai } from 'chai';
import { DatabaseState, ServerStatus } from 'model/global/serverStatus/serverStatus.types';

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
            describe('check connection to the database', () => {
              let result: ServerStatus;
              let sdkStart: jest.Mock<Promise<void>, []>;

              describe('Happy path', () => {
                beforeAll(async () => {
                  sdkStart = jest.fn().mockResolvedValue(null);

                  result = await checkDbConnection
                    .apply(null, [sdkStart])
                    .apply(null, [SERVER_STATUS]);
                });

                it('Should test connection to the db', () => {
                  expect(sdkStart)
                    .toHaveBeenCalledTimes(1);
                  expect(sdkStart)
                    .toHaveBeenCalledWith();
                });

                it(`Should set 'db' item to 'true', if connection test has been executed successfully`, () => {
                  expectChai(result.db)
                    .to.be.an('string')
                    .which.is.equal(DatabaseState.Up);
                });

                it(`Should keep existing items, after has been executed`, () => {
                  expectChai(result)
                    .to.be.an('object')
                    .which.is.deep.equal({
                      ...SERVER_STATUS,
                      db: DatabaseState.Up
                    });
                });
              });

              describe('Error path', () => {
                beforeAll(async () => {
                  sdkStart = jest.fn().mockRejectedValue(null);

                  result = await checkDbConnection
                    .apply(null, [sdkStart])
                    .apply(null, [SERVER_STATUS]);
                });

                it(`Should set 'db' item to 'false', if connection test has not been executed successfully`, () => {
                  expectChai(result.db)
                    .to.be.an('string')
                    .which.is.equal(DatabaseState.Down);
                });

                it(`Should keep existing items, after has been executed`, () => {
                  expectChai(result)
                    .to.be.an('object')
                    .which.is.deep.equal(SERVER_STATUS);
                });
              });
            });
          });
        });
      });
    });
  });
});
