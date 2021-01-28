export enum ENodeENV {
  development = 'development',
  production = 'production',
  test = 'test'
}

export interface INodeEnv {
  environment: ENodeENV;
}
