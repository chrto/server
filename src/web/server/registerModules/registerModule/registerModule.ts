import logger from 'utils/logger';
import registerModuleUnbound from './registerModule.unbound';

export default registerModuleUnbound.apply(null, [logger]);
