import { hostname } from 'os';

import { version } from '../../package.json';

// returns version based on the process.env.BUILD_NUMBER variable

export interface Version {
  getVersion(): string;
  getBuildNumber(): string;
  setEnv(val: string): void;
  getEnv(): string;
  getDefaultEnv(): string;
  getHostname(): string;
  UNKNOWN_BUILD_NUMBER: string;
}

// const VERSION = require('../../package.json').version;
const UNKNOWN_VERSION = 'Unknown Version';
const UNKNOWN_BUILD_NUMBER = 'Unknown BuildNumber';
const DEFAULT_ENV_VAR = 'BUILD_NUMBER';

let env_name = DEFAULT_ENV_VAR;

const setEnv = (envVar: string) => {
  env_name = envVar;
};

const getEnv = () => env_name;

const getDefaultEnv = () => DEFAULT_ENV_VAR;

const getVersion = () => version && `${version}` || UNKNOWN_VERSION;

const getBuildNumber = () =>
  env_name in process.env && process.env[env_name] || UNKNOWN_BUILD_NUMBER;

const getHostname = () => hostname();

const Version: Version = {
  getVersion,
  getBuildNumber,
  setEnv,
  getEnv,
  getDefaultEnv,
  getHostname,
  UNKNOWN_BUILD_NUMBER
};

export default Version;
