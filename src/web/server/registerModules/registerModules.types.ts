import { Fcn } from 'common/types';
import { Router } from 'express';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AppConfig } from '../configuration/loader/appConfig.types';

export type RouterConfigurator = Fcn<[PluginSdkService, AppConfig], Router>;
export type RouterPath = string | RegExp | Array<string | RegExp>;

export interface Module {
  routerPath: RouterPath;
  routerConfigurator: RouterConfigurator;
}

export type ModuleMapping = {
  [name: string]: Module
};
