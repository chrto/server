import { AppError } from 'common/error';
import { Conflict, InvalidInput, NotAuthenticated, NotAuthorized, NotFound } from 'common/httpErrors';
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';

export default (logger: Logger) =>
  (err: any, _req: Request, res: Response, _next: NextFunction): void => {
    if (!(err instanceof AppError)) {
      logger.error(`- error: should return 500:`);
      logger.error(err);
      res.status(500).send({ message: 'error', details: 'Internal Server Error' });
    } else {
      if (err instanceof NotAuthorized) {
        logger.error(`- not authorized`);
        logger.error(`- reason: ${err.message}`);
        res.status(403).send({ message: err.code, details: err.message });
      } else if (err instanceof NotAuthenticated) {
        logger.error('- not authenticated');
        logger.error(`- reason: ${err.message}`);
        res.status(401).send({ message: err.code, details: err.message });
      } else if (err instanceof NotFound) {
        logger.error('- not found');
        logger.error(`- reason: ${err.message}`);
        res.status(404).send({ message: err.code, details: err.message });
      } else if (err instanceof Conflict) {
        logger.error('- resource update conflict');
        logger.error(`- reason: ${err.message}`);
        res.status(409).send({ message: err.code, details: err.message });
      } else if (err instanceof InvalidInput) {
        logger.error('- invalid input');
        logger.error(`- reason: ${err.message}`);
        res.status(400).send({ message: err.code, details: err.message });
      } else {
        logger.error(`- unhandled error type: code = ${err.code} - returning status 500`);
        logger.error(`- reason: ${err.message}`);
        res.status(500).send({ message: err.code, details: err.message });
      }
    }
  };
