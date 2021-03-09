import { AppError } from 'common/error';
import { Fcn } from 'common/types';
import { Either } from 'tsmonad';
import eitherify from 'utils/monad/either/eitherify/eitherify';
import { FSPath, FSMKDirOptions } from '../file.types';

export default (mkDirSync: Fcn<[FSPath, FSMKDirOptions], void>) =>
  (path: FSPath, options: FSMKDirOptions): Either<AppError, void> =>
    eitherify(mkDirSync)(path, options);
