import requestHandlerUnbound from './requestHandler.unbound';
import logger from 'utils/logger';

export default requestHandlerUnbound.apply(null, [logger]);
