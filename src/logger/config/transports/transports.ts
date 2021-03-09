import customFormat from '../format/format';
import transportOptions from './options/options';
import { Maybe } from 'tsmonad';
import { Format } from 'logform';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import build from './build/build';
import { TransportsDefinition } from './transports.types';

export default ({ appLogger }: AppConfig): Maybe<TransportsDefinition> =>
  Maybe.maybe<Format>(customFormat(appLogger))
    .lift(transportOptions(appLogger))
    .lift(build(appLogger));
