import requestHandlerUnbound from './requestHandler.unbound';
import appLogger from 'logger/appLogger';

export default requestHandlerUnbound.apply(null, [appLogger]);
