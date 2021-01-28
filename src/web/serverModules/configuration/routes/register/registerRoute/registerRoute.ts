import registerRouteUnbound from './registerRoute.unbound';
import requestHandler from './requestHandler/requestHandler';

export default registerRouteUnbound.apply(null, [requestHandler]);
