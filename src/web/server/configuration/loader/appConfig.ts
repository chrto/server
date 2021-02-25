import appConfigUnbound from './appConfig.unbound';
import loadNodeEnvConfiguration from './nodeEnv/nodeEnvConfig';
import loadServerConfiguration from './server/serverConfig';
import loadDatabaseConfiguration from './database/databaseConfig';
import loadSSOConfiguration from './sso/ssoConfig';
import loadLoggerConfiguration from './logger/loggerConfig';

export default appConfigUnbound.apply(null, [{ loadNodeEnvConfiguration, loadServerConfiguration, loadDatabaseConfiguration, loadSSOConfiguration, loadLoggerConfiguration }]);
