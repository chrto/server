import { AppError } from './error';

describe('Common module', () => {
  describe('AppError', () => {
    it('ApError extends Error', () => {
      let err = new AppError('server.error', 'Internal Server Error');
      expect(err).toBeInstanceOf(Error);
    });
  });
});
