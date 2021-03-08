import logger from './appLogger';
export default (message?: string) =>
  <E> (e: E): E => {
    logger.error(`\n ${message ? message + '\n' : ''} ${e}`);
    return e;
  };
