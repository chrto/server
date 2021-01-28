import registerMiddlewares from 'web/serverModules/configuration/middlewares/registerMiddlewares';
import middlewares from 'web/serverModules/common/middlewares/middlewares';

const { cors, logger } = middlewares;
const { expressLogger, expressErrorLogger } = logger;
export default registerMiddlewares.apply(null, [[cors, expressLogger, expressErrorLogger]]);
