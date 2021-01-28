import shutdownListenerUnbound from './shutdownListener.unbound';
import * as express from 'express';
import * as cors from 'cors';
import logger from 'utils/logger';

export default shutdownListenerUnbound
  .apply(null, [logger, setTimeout, cors])
  .apply(null, [express()]);
