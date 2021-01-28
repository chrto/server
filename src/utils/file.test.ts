import {expect} from 'chai';
import {anyString, anything, reset, resetCalls, spy, verify, when} from 'ts-mockito';

import {load, loadSync} from './file';

const fs = require('fs');

const checkCalledOnce = <S>(spiedCall: S) => {
  verify(spiedCall).once();
};

const check = <S>(expected: string, spiedCall: S) =>
  (result: string) => {
    checkCalledOnce(spiedCall);
    expect(result).to.be.equal(expected);
  };

const checkCatchBlock = (instanceOf, done) =>
  (error) => {
    expect(error)
    .to.be.an('error')
    .that.is.instanceOf(instanceOf);
    done();
  };

describe('Test `utils/file` module.', () => {
  const ERROR_FILE_NAME = 'error.dot';
  const SUCCESS_FILE_NAME = 'success.dot';
  const FILE_CONTENT = 'file content..';
  const SYNC_FILE_CONTENT = 'sync file content..';
  const ERROR_MESSAGE = 'error message..';

  let spiedFS;

  beforeAll(() => {
    spiedFS = spy(fs);
    when(spiedFS.readFile(anyString(), anyString(), anything()))
      .thenCall((filename: string, _encoding: string, callback: (err: NodeJS.ErrnoException, data: string) => void) => {
            filename === SUCCESS_FILE_NAME
              ? callback(null, FILE_CONTENT)
              : callback(new Error(ERROR_MESSAGE), null);
      });
    when(spiedFS.readFileSync(anyString(), anyString()))
      .thenCall((_filename: string, _encoding = 'utf8'): string => SYNC_FILE_CONTENT);
  });

  afterAll(() => {
    reset(spiedFS);
  });

  beforeEach(() => {
    resetCalls(spiedFS);
  });

  it('load() should resolve with file content', async () => {
    const result = await load(SUCCESS_FILE_NAME);
    check(FILE_CONTENT, spiedFS.readFile(anyString(), anyString(), anything()))(result);
  });

  it('load() should reject with specific error', (done) => {
    load(ERROR_FILE_NAME)
      .then(() => {done(new Error('Promise should not be resolved')); })
      .catch(checkCatchBlock(Error, done));
  });

  it('loadSync() should return file content as string', async () => {
    const result = loadSync(SUCCESS_FILE_NAME);
    expect(result).to.be.equal(SYNC_FILE_CONTENT);
    check(SYNC_FILE_CONTENT, spiedFS.readFileSync(anyString(), anyString()))(result);
  });
});
