import { InternalServerError } from 'common/httpErrors';
import { Logger } from 'winston';
import errorHandlerUnbound from './errorHandler.unbound';

describe('server builder module', () => {
  describe(`'error handler'`, () => {
    let errorHandler;
    let mockLogger: Logger = {} as Logger;
    let mockProcess: NodeJS.Process = {} as NodeJS.Process;
    const error = new InternalServerError();
    beforeAll(() => {
      mockProcess.exit = jest.fn().mockImplementation((_code?: number): any => undefined) as unknown as (code: number) => never;
      mockLogger.error = jest.fn().mockImplementation((_msg: string): Logger => mockLogger);
      errorHandler = errorHandlerUnbound.apply(null, [mockLogger, mockProcess]);
    });
    it(`Should log error`, () => {
      errorHandler(error);
      expect(mockLogger.error)
        .toHaveBeenCalledWith(error.code);
      expect(mockLogger.error)
        .toHaveBeenCalledWith(error.message);
    });
    it(`Should exit with code '-1'`, () => {
      errorHandler(error);
      expect(mockProcess.exit)
        .toHaveBeenCalledWith(-1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
