import initUnbound from './init.unbound';

import * as cluster from 'cluster';
import { addColors } from 'winston';

import transports from '../config/transports/transports';
import loggerOptions from './options/options';
import buildLogger from './buildLogger/buildLogger';

export default initUnbound
  .apply(null, [cluster.isMaster])
  .apply(null, [addColors])
  .apply(null, [transports, loggerOptions, buildLogger]);
