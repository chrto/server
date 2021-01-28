import { AppError } from 'common/error';
import { Either, Maybe } from 'tsmonad';
import { Response } from 'express';
import { AppRequest } from 'web/serverModules/types';

export type ContextCreator<CTX> = (req: AppRequest) => CTX;

export type ModuleDef<CTX> = {
  [pathPrefix: string]: HandlerDef<CTX>
};

export interface Handler<CTX> {
  action: (context: CTX, req: AppRequest, res: Response) => Promise<Either<AppError, any>>;
  authorization: (context: CTX) => Maybe<string>;
}

export type HandlerDef<CTX> = {
  [M in Methods]?: Handler<CTX>
};

export type Methods = 'get' | 'post' | 'put' | 'patch' | 'delete';
