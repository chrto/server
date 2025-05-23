import retry from './retry';
import { AppError } from 'common/error';

describe('Test `retry` module', function () {
  const operationRejected = (): Promise<void> =>
    Promise.reject(new AppError('app.error', 'Promise is rejected'));

  const operationResolved = (): Promise<void> =>
    Promise.resolve();

  const TIMEOUT = 5;
  let RETRIES = 10;
  const SILENT = true;

  it('retry() should resolve with good operation', function (done) {
    retry(operationResolved, TIMEOUT, RETRIES, AppError, SILENT)
      .then(
        () => done()
      )
      .catch(
        (_err) => done(new Error('Promise should be resolved'))
      );
  });

  it('retry() should fail on bad operation afte several retries', function (done) {
    retry(operationRejected, TIMEOUT, 5, AppError, SILENT)
      .then(
        () => done(new Error('Promise should not be rejected'))
      )
      .catch(
        () => done()
      );
  });

  it('retry() should handle rejection with specific error', function (done) {
    retry(operationRejected, TIMEOUT, 1, AppError, SILENT)
      .then(
        () => { done(new Error('Promise should not be resolved')); }
      )
      .catch(
        (err) => {
          expect(err).toBeInstanceOf(AppError);
          expect(err.code).toBe('app.error');
          expect(err.message).toBe('Promise is rejected');
          done();
        }
      );
  });
});
