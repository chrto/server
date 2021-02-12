import { InvalidInput, NotAuthenticated, NotFound } from 'common/httpErrors';
import { AxiosError } from 'axios';
import { Maybe } from 'tsmonad';
import { AppError } from 'common/error';
import { Fcn } from 'common/types';

export default (logError: Fcn<[string], <E>(e: E) => E>) =>
  (error: AxiosError): AppError =>
    Maybe.just(error)
      .lift(logError(!!error.response && !!error.response.statusText && !!error.response.data.error_description
        ? error.response.statusText + '\n' + error.response.data.error_description
        : !!error.toJSON ? error.toJSON()['message'] : 'unknon error'
      ))
      .lift((error: AxiosError): AppError => {
        if (!error.response) {
          return new AppError(error.code, error.message);
        }
        switch (error.response.status) {
          case 400:
            return new InvalidInput(error.response.data.error_description || error.response.data.message || error.toJSON()['message']);
          case 401:
            return new NotAuthenticated(error.response.data.error_description || error.response.data.message || error.toJSON()['message']);
          case 404:
            return new NotFound(error.response.data.error_description || error.response.data.message || error.toJSON()['message']);
          default:
            return new AppError(error.response.statusText, error.response.data.error_description);
        }
      })
      .caseOf({
        just: (error: AppError) => error,
        nothing: () => null
      });
