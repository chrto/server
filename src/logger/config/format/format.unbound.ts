import { Format, TransformableInfo } from 'logform';
import { ILoggerConfig } from 'web/server/configuration/loader/logger/loggerConfig.types';
import messageTemplate from './messageTemplate/messageTemplate';

const customPringFormat = (printf: (templateFunction: (info: TransformableInfo) => string) => Format, templateFunction: (info: TransformableInfo) => string): Format =>
  printf(templateFunction);

export default ({ combine, timestamp, label, printf, prettyPrint, json }) =>
  (loggerConfig: ILoggerConfig): Format =>
    combine(
      label({ label: `[${loggerConfig.label}]` }),
      prettyPrint(),
      timestamp(),
      json(),
      customPringFormat(printf, messageTemplate)
    );
