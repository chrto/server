import { Fcn } from 'common/types';
import { Express, Request, Response } from 'express';
import { Logger } from 'winston';

const middleware = (logger: Logger, setTimeout: Fcn<[Fcn<[any[]], void>, number]>) =>
  (listening: Fcn<[], boolean>, actions: Fcn<[], Promise<void>>) =>
    (message: string) =>
      (_request: Request, response: Response<any>) => {
        if (listening()) {
          logger.debug(message);
          response.setHeader('Connection', 'close');
          response.send('ok');
          setTimeout(actions, 0);
        } else {
          logger.debug('server is not listening..');
          response
            .status(409)
            .send({ message: 'conflict', details: 'server is not listening..' });
        }
      };

export default (logger: Logger, setTimeout: Fcn<[Fcn<[any[]], void>, number], NodeJS.Timeout>, cors: Fcn<[], any>) =>
  (expressApp: Express) =>
    (shutdown: Fcn<[], Promise<void>>, restart: Fcn<[], Promise<void>>, listening: Fcn<[], boolean>): Express =>
      expressApp
        .use(cors())
        .get('/shutdown', middleware
          .apply(null, [logger, setTimeout])
          .apply(null, [listening, shutdown])
          .apply(null, ['shuting down server..']))
        .get('/restart', middleware
          .apply(null, [logger, setTimeout])
          .apply(null, [listening, restart])
          .apply(null, ['restarting server..']));
