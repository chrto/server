import { pipe } from 'ramda';
import { WebServer } from '../../../../server/types';
import { ServerLayer } from './unregisterRouters.types';

const ROUTER_LAYER_NAME = 'router';

export default (server: WebServer): WebServer =>
  pipe(
    (server: WebServer): ServerLayer[] => server.expressApp._router.stack.filter((layer: ServerLayer): boolean => layer.name !== ROUTER_LAYER_NAME),
    (layers: ServerLayer[]): WebServer => (
      server.expressApp._router.stack = layers,
      server
    )
  )(server);
