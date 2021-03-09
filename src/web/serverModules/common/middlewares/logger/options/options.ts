import optionsUnbound from './options.unbound';
import messageTemplate from './messageTemplate';
import getTransportsDefinition from 'logger/config/transports/transports';

export default optionsUnbound(getTransportsDefinition, messageTemplate);
