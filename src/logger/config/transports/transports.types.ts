import * as Transport from 'winston-transport';

export interface TransportsDefinition {
  logger: Transport[];
  exception: Transport[];
}
