import { Fcn } from 'common/types';
import { NextFunction, Response } from 'express';
import { User as PortalUser } from 'model/sequelize/user/user';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AppRequest } from 'web/serverModules/types';

export interface RequestImplicits {
  user?: PortalUser;
}

export type ParamHandlerFunction<RI, ID = string> = Fcn<[PluginSdkService], Fcn<[AppRequest<unknown, unknown, unknown, RI>, Response, NextFunction, ID], Promise<void>>>;

export interface ParamHandlers {
  user: ParamHandlerFunction<RequestImplicits>;
}
