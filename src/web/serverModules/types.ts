import { Request, Router } from 'express';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { ModuleDef } from './configuration/routes/register/registerRoutes.types';

export type Jwt = {
  header: {
    typ?: 'JWT',
    alg: string,
    x5t?: string
  }
  payload: JwtPayload,
  signature: string
};

export enum JwtPayloadItemDev {
  AUD = 'aud',
  ISS = 'iss',
  IAT = 'iat',
  EXP = 'exp',
  OID = 'oid',
  PREFERRED_USERNAME = 'preferred_username',
  UNIQUE_USERNAME = 'unique_name',
  FAMILY_NAME = 'family_name',
  GIVEN_NAME = 'given_name',
  UPN = 'upn',
  NAME = 'name',
  SUB = 'sub',
  TID = 'tid',
  VER = 'ver'
}

export interface JwtPayload {
  [JwtPayloadItemDev.AUD]?: string;
  [JwtPayloadItemDev.ISS]?: string;
  [JwtPayloadItemDev.IAT]?: number;
  [JwtPayloadItemDev.EXP]?: number;
  [JwtPayloadItemDev.NAME]?: string;
  [JwtPayloadItemDev.OID]?: string;
  [JwtPayloadItemDev.PREFERRED_USERNAME]?: string;
  [JwtPayloadItemDev.UNIQUE_USERNAME]?: string;
  [JwtPayloadItemDev.FAMILY_NAME]?: string;
  [JwtPayloadItemDev.GIVEN_NAME]?: string;
  [JwtPayloadItemDev.UPN]?: string;
  [JwtPayloadItemDev.SUB]?: string;
  [JwtPayloadItemDev.TID]?: string;
  [JwtPayloadItemDev.VER]?: string;
}

export interface AppRequest<QT = unknown, BT = unknown, UT = unknown, IT = unknown> extends Request {
  jwt: JwtPayload;
  query: QT;
  body: BT;
  ssoConfig?: ISSOConfig;
  implicits?: IT;
  currentUser?: UT;
}

export type ControllerFactory<CTL> = (service: PluginSdkService) => CTL;
export type ContextFactory<CTX, RU = unknown> = (request?: AppRequest<unknown, unknown, RU>) => CTX;
export type ModuleConfigFactory<CTX> = (config: ModuleConfig<CTX>) => ModuleConfig<CTX>;
export interface ModuleConfig<CTX> {
  router: Router;
  moduleDefinition: ModuleDef<CTX>;
  contextFactory: ContextFactory<CTX>;
}
