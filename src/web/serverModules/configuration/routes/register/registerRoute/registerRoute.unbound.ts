import { _do } from 'utils/either';
import { RequestHandler, Response, Router } from 'express';
import { Fcn } from 'common/types';
import { Handler, HandlerDef, ModuleDef, ContextCreator } from '../registerRoutes.types';
import { pipe } from 'ramda';
import { ModuleConfig } from 'web/serverModules/types';

export default <CTX, RB = unknown>(requestHandler: Fcn<[Handler<CTX>, ContextCreator<CTX>, Fcn<[Response<RB>], Fcn<[RB], Response<RB>>>], RequestHandler>) =>
  ({ moduleDefinition, router, contextFactory }: ModuleConfig<CTX>, send: Fcn<[Response], Fcn<[any], Response<any>>>) =>
    (path: string): void => {
      pipe(
        (moduleDef: ModuleDef<CTX>): HandlerDef<CTX> => moduleDef[path],
        (endpointDef: HandlerDef<CTX>): void =>
          Object.keys(endpointDef)
            .forEach((method: string): Router => router[method](path, requestHandler(endpointDef[method], contextFactory, send)))
      )(moduleDefinition);
    };
