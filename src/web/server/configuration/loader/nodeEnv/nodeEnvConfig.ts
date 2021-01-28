import { ENodeENV } from './nodeEnvConfig.types';
import nodeEnvConfigUnbound from './nodeEnvConfig.unbound';

export default nodeEnvConfigUnbound.apply(null, [ENodeENV[process.env.NODE_ENV]]);
