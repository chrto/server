import checkAllSystemsWorking from './checkAllSystemsWorking';
import { expect as expectChai } from 'chai';
import { DatabaseState, ServerStatus, ServiceItem } from 'model/global/serverStatus/serverStatus.types';

const SERVER_STATUS: ServerStatus = Object.freeze({
  buildNumber: '',
  version: '1.0.1',
  host: 'test',
  db: DatabaseState.Up,
  services: {
    [ServiceItem.sso]: true
  },
  allSystemsWorking: false
});

describe('Web Server', () => {
  describe('Modules', () => {
    describe('Global', () => {
      describe('controller', () => {
        describe('status', () => {
          describe('get status controller', () => {
            describe('check if all systems are up', () => {
              let result: ServerStatus;
              describe('Happy path', () => {
                beforeAll(() => {
                  result = checkAllSystemsWorking
                    .apply(null, [SERVER_STATUS]);
                });

                it(`Should set 'allSystemsWorking' item to true, if all services are up and connection to db has been established`, () => {
                  expectChai(result)
                    .to.be.an('object')
                    .which.haveOwnProperty('allSystemsWorking')
                    .which.is.equal(true);
                });

                it(`Should keep existing items, after has been executed`, () => {
                  expectChai(result)
                    .to.be.an('object')
                    .which.is.deep.equal({ ...SERVER_STATUS, allSystemsWorking: true });
                });
              });

              describe('Error path', () => {
                describe('DB down', () => {
                  beforeAll(() => {
                    result = checkAllSystemsWorking
                      .apply(null, [{ ...SERVER_STATUS, db: DatabaseState.Down }]);
                  });

                  it(`Should set 'allSystemsWorking' item to false, if all services are up and connection to db has not been established`, () => {
                    expectChai(result)
                      .to.be.an('object')
                      .which.haveOwnProperty('allSystemsWorking')
                      .which.is.equal(false);
                  });
                });
                describe('Service down', () => {
                  beforeAll(() => {
                    result = checkAllSystemsWorking
                      .apply(null, [{ ...SERVER_STATUS, services: { [ServiceItem.sso]: false } }]);
                  });

                  it(`Should set 'allSystemsWorking' item to false, if any service is down and connection to db has been established`, () => {
                    expectChai(result)
                      .to.be.an('object')
                      .which.haveOwnProperty('allSystemsWorking')
                      .which.is.equal(false);
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
