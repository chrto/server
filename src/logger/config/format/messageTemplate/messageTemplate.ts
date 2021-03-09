import { TransformableInfo } from 'logform';

export default (info: TransformableInfo): string =>
  `${info.label} ${info.timestamp} ${info.level} ${info.message}`;
