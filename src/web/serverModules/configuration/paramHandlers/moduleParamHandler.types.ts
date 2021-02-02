import { Fcn } from 'common/types';
import { Response, NextFunction } from 'express';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AppRequest } from 'web/serverModules/types';

export type ParamHandler<RI extends object = {}, ID = string> = Fcn<[AppRequest<unknown, unknown, unknown, RI>, Response, NextFunction, ID], Promise<void>>;
export type ParamHandlerFactory<RI extends object = {}, ID = string> = Fcn<[PluginSdkService], ParamHandler<RI, ID>>;
export type ParamHandlers<MP extends string, RI extends object = {}> = Record<MP, ParamHandlerFactory<RI>>;
