import registerParamHandlers from 'web/serverModules/configuration/paramHandlers/moduleParamHandler';
import handlers from '../../paramHandlers/paramHandlers';

export default registerParamHandlers
  .apply(null, [handlers]);
