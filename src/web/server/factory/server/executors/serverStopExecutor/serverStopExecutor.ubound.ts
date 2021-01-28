import { Server } from 'http';
import { Logger } from 'winston';

export default (logger: Logger, message: string) =>
  (server: Server) =>
    (resolve: () => void, reject: (reason: any) => void): void => {
      server.close((error: Error): void =>
        !!error
          ? reject(error)
          : (
            logger.info(message),
            resolve()
          ));
    };
