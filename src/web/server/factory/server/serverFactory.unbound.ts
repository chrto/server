import { ServerFactoryParams } from '../params/factoryParams.types';
import { WebServer } from '../../types';

export default (Server: (params: ServerFactoryParams) => void) =>
  (params: ServerFactoryParams): WebServer =>
    new Server(params);
