import { expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import eitherify from 'utils/monad/either/eitherify/eitherify';

describe('Either', () => {
  describe(`'eitherify'`, () => {
    const ERROR_MESSAGE: string = 'Function has been executed with error';
    const ERROR_CODE: string = 'error.code';

    it('Should return Either with result in right side, if function has been executed successfully', () => {
      const f = (a: number, b: number, c: number, d: string) => `${d}: ${a + b + c}`;
      eitherify<[number, number, number, string], string>(f)(2, 1, 3, 'result')
        .do({
          right: v => expectChai(v)
            .to.be.an('string')
            .which.is.equal('result: 6')
        });
    });

    it('Should return Either with exact AppError in left side, if function has been thrown Error', () => {
      const f = (_a: number, _b: number, _c: number, _d: string) => {
        throw {} as Error;
      };
      eitherify<[number, number, number, string], string>(f)(2, 1, 3, 'result')
        .do({
          left: (e: AppError) => {
            expectChai(e)
              .to.be.instanceOf(AppError);
            expectChai(e.message)
              .to.be.equal('unknown error');
            expectChai(e.code)
              .to.be.equal('');
          }
        });
    });

    it('Should return Either with exact AppError in left side, if function has been thrown AppError', () => {
      const f = (_a: number, _b: number, _c: number, _d: string) => {
        throw new AppError(ERROR_CODE, ERROR_MESSAGE);
      };
      eitherify<[number, number, number, string], string>(f)(2, 1, 3, 'result')
        .do({
          left: (e: AppError) => {
            expectChai(e)
              .to.be.instanceOf(AppError);
            expectChai(e.message)
              .to.be.equal(ERROR_MESSAGE);
            expectChai(e.code)
              .to.be.equal(ERROR_CODE);
          }
        });
    });

    it('Should return Either with exact AppError in left side, if function has been thrown Error', () => {
      const f = (_a: number, _b: number, _c: number, _d: string) => {
        throw { message: ERROR_MESSAGE, code: ERROR_CODE };
      };
      eitherify<[number, number, number, string], string>(f)(2, 1, 3, 'result')
        .do({
          left: (e: AppError) => {
            expectChai(e)
              .to.be.instanceOf(AppError);
            expectChai(e.message)
              .to.be.equal(ERROR_MESSAGE);
            expectChai(e.code)
              .to.be.equal(ERROR_CODE);
          }
        });
    });
  });
});
