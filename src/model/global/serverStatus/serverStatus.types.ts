export enum DatabaseState {
  Up = 'Up',
  Down = 'Down'
}

export enum ServiceItem {
  sso = 'sso'
}

export interface ServerStatus {
  buildNumber: string;
  version: string;
  host: string;
  db: DatabaseState;
  services: {
    [ServiceItem.sso]?: boolean;
  };
  allSystemsWorking: boolean;
}
