import appLogger from 'logger/appLogger';
import registerModuleUnbound from './registerModule.unbound';

export default registerModuleUnbound.apply(null, [appLogger]);
