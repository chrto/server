import { AppConfig } from '../loader/appConfig.types';
import { Logger } from 'winston';
import { ENodeENV } from '../loader/nodeEnv/nodeEnvConfig.types';

export default (logger: Logger) =>
  (appConfig: AppConfig): void => {
    appConfig.environment === ENodeENV.development && logger
      .debug('Environment setup:')
      .debug(`'NODE_ENV'                   ='${appConfig.environment}'`)

      .debug('Server setup:')
      .debug(`'API port'                   ='${appConfig.server.apiPort}'`)
      .debug(`'shutdown port'              ='${appConfig.server.shutdownPort}'`)
      .debug(`'shutdown timeout'           ='${appConfig.server.shutdownTimeout}'`)
      .debug(`'startup delay'              ='${appConfig.server.startupDelay}'`)
      .debug(`'retry count'                ='${appConfig.server.retryCount}'`)

      .debug('SSO setup:')
      .debug(`'issuer'                     ='${appConfig.sso.ssoIssuer}'`)
      .debug(`'JWKS uri'                   ='${appConfig.sso.ssoJwksUri}'`)
      .debug(`'well-known endpoint         ='${appConfig.sso.ssoWellKnown}'`)
      .debug(`'token endpoint'             ='${appConfig.sso.ssoTokenEndpoint}'`)
      .debug(`'end session endpoint'       ='${appConfig.sso.ssoEndSessionEndpoint}'`)
      .debug(`'client ID'                  ='${appConfig.sso.ssoClientId}'`)
      .debug(`'client secret'              ='${appConfig.sso.ssoClientSecret}'`)
      .debug(`'hash alg.'                  ='${appConfig.sso.ssoHashAlg}'`)
      .debug(`'redirect uri'               ='${appConfig.sso.ssoRedirectUri}'`)

      .debug('Database setup:')
      .debug(`'DB URL'                    ='${appConfig.database.url}'`)
      .debug(`'DB dialect'                ='${appConfig.database.dialect}'`)
      .debug(`'DB allow sync'             ='${appConfig.database.allowSync}'`)
      .debug(`'DB allow logging'          ='${appConfig.database.allowLogging}'`)

      .debug('Logger setup:')
      .debug(`'Log label'                 ='${appConfig.appLogger.label}'`)
      .debug('File log:')
      .debug(`'Directory'                 ='${appConfig.appLogger.dir}'`)
      .debug(`'Level'                     ='${appConfig.appLogger.fileLevel}'`)
      .debug(`'Log file name'             ='${appConfig.appLogger.fileNameInfo}'`)
      .debug(`'Error log file name'       ='${appConfig.appLogger.fileNameError}'`)
      .debug(`'Exceptions log file name'  ='${appConfig.appLogger.fileNameExceptions}'`)
      .debug(`'Rotate log pattern'        ='${appConfig.appLogger.fileDatePattern}'`)
      .debug(`'Archive log files'         ='${appConfig.appLogger.fileZipArchive}'`)
      .debug(`'Log file max size'         ='${appConfig.appLogger.fileMaxSize}'`)
      .debug(`'Log file max'              ='${appConfig.appLogger.fileMaxFiles}'`)
      .debug('Console log:')
      .debug(`'Level'                     ='${appConfig.appLogger.consoleLevel}'`)
      .debug(`'Enable'                    ='${appConfig.appLogger.consoleEnable}'`);
  };
