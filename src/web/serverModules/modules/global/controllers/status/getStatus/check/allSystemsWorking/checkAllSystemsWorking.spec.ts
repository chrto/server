import checkAllSystemsWorking from './checkAllSystemsWorking';
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
                  expect(result).toBeObject;
                  expect(result).toHaveProperty('allSystemsWorking', true);
                });

                it(`Should keep existing items, after has been executed`, () => {
                  expect(result).toBeObject;
                  expect(result).toStrictEqual({ ...SERVER_STATUS, allSystemsWorking: true });
                });
              });

              describe('Error path', () => {
                describe('DB down', () => {
                  beforeAll(() => {
                    result = checkAllSystemsWorking
                      .apply(null, [{ ...SERVER_STATUS, db: DatabaseState.Down }]);
                  });

                  it(`Should set 'allSystemsWorking' item to false, if all services are up and connection to db has not been established`, () => {
                    expect(result).toBeObject;
                    expect(result).toHaveProperty('allSystemsWorking', false);
                  });
                });
                describe('Service down', () => {
                  beforeAll(() => {
                    result = checkAllSystemsWorking
                      .apply(null, [{ ...SERVER_STATUS, services: { [ServiceItem.sso]: false } }]);
                  });

                  it(`Should set 'allSystemsWorking' item to false, if any service is down and connection to db has been established`, () => {
                    expect(result).toBeObject;
                    expect(result).toHaveProperty('allSystemsWorking', false);
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
