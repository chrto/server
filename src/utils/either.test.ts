import { assert, expect as expectChai } from 'chai';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { takeRight, valueOrError, caseOf, eitherify, ftap } from 'utils/either';

describe('Either', () => {
  describe('ftap', () => {
    it(`Should tap Either, if function has been executed successfully`, () => {
      const f = (_val: string): Either<AppError, void> => Either.right(null);
      ftap(f)(Either.right('text'))
        .do({
          right: (val: string): void => {
            expectChai(val)
              .to.be.eqls('text');
          },
          left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
        });
    });

    it(`Should return Either with exact error, if function has been expected with error`, () => {
      const ERROR_MESSAGE = 'some error desc.';
      const f = (_val: string): Either<AppError, void> => Either.left(new AppError('code', ERROR_MESSAGE));
      ftap(f)(Either.right('text'))
        .do({
          right: (): void => fail(`Right side has not been expected`),
          left: (error: AppError) => {
            expect(error)
              .toBeInstanceOf(AppError);
            expect(error.message)
              .toEqual(ERROR_MESSAGE);
          }
        });
    });
  });

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

  describe(`'takeRight'`, () => {
    it('Should return value, if right side.', () => {
      const val: number = 10;
      const either = Either.right<AppError, number>(val);
      Promise.resolve(either)
        .then(caseOf(takeRight()))
        .then((value: number) => {
          expectChai(value)
            .to.be.an('number')
            .which.is.equal(val);
        });
    });

    it('Should return null, if left side.', () => {
      const either = Either.left<AppError, number>(new AppError('code', 'message'));
      Promise.resolve(either)
        .then(caseOf(takeRight()))
        .then((value: number) => {
          expectChai(value)
            .to.be.equal(null);
        });
    });
  });
  describe('Value or error function', () => {

    const valueOrErrorTestCases = [{
      description: 'should return value',
      either: Either.right({ test: 'test' }),
      right: value => assert.isNotNull(value),
      left: () => null
    }, {
      description: 'should return error',
      either: null,
      right: () => null,
      left: error => assert.isNotNull(error)
    }];

    valueOrErrorTestCases.forEach(testCase =>
      it(testCase.description, () =>
        valueOrError(new AppError('1', 'testing app error'))(testCase.either).caseOf({
          right: testCase.right,
          left: testCase.left
        })
      )
    );
  });
});
