import logger from 'utils/logger';
import sleep from './sleep';

const retry = <T>(operation: () => Promise<void>, delay: number = 1000, retries: number = 10, err: T = null, silent: boolean = false) =>
  !retries
    ? Promise.reject(err)
    : operation()
      .catch(
        (err: T) => {
          if (!silent) {
            logger.error(`Failing operation ${err}, ${retries} retries left with ${delay} ms delay`);
          }
          return sleep(delay)
            .then(
              retry.bind(null, operation, delay, (retries - 1), err, silent)
            );
        }
      );

export default retry;
