import { assert } from 'chai';
import Version from './version';

describe('Test `Version` module.', () => {

  it('default ENV should be `BUILD_NUMBER`', () => {
    const DEFAULT_ENV_VAR = 'BUILD_NUMBDER';

    assert(Version.getDefaultEnv(), DEFAULT_ENV_VAR);
  });

  it('should set correctly custom ENV value', () => {
    const CUSTOM_ENV = 'BUILD_NUMBER_EXTRA';
    Version.setEnv(CUSTOM_ENV);

    assert(Version.getEnv, CUSTOM_ENV);
    Version.setEnv(Version.getDefaultEnv());
  });

  it(`getVersion() should return string`, () => {
    assert.isString(Version.getVersion());
  });

  it(`getBuildNumber() should return correct Build Number when ENV is set`, () => {
    const BUILD_NUMBER_VAL = 'Test Build';
    process.env[Version.getDefaultEnv()] = BUILD_NUMBER_VAL;

    assert.equal(Version.getBuildNumber(), BUILD_NUMBER_VAL);
  });

  it(`getBuildNumber() should return '${Version.UNKNOWN_BUILD_NUMBER}' when no ENV is set`, () => {
    delete process.env[Version.getDefaultEnv()];
    assert.equal(Version.getBuildNumber(), Version.UNKNOWN_BUILD_NUMBER);
  });

  it(`getBuildNumber() should return correct Build Number with custom ENV`, () => {
    const CUSTOM_ENV = 'BUILD_NUMBER_EXTRA';
    const BUILD_NUMBER = 'Test Build Custom';
    process.env[CUSTOM_ENV] = BUILD_NUMBER;

    Version.setEnv(CUSTOM_ENV);
    assert.equal(Version.getBuildNumber(), BUILD_NUMBER);
  });

  it(`getHostname() should return non empty string`, () => {
    assert.isNotEmpty(Version.getHostname());
  });

});
