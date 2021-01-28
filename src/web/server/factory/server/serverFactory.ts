import serverFactoryUnbound from './serverFactory.unbound';
import Server from './server';

export default serverFactoryUnbound
  .apply(null, [Server]);
