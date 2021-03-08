import optionsUnbound from './options.unbound';
import { format } from 'winston';

export default optionsUnbound
  .apply(null, [format]);
