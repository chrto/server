import moment = require('moment');

export const ISO_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]';
export const timestamp_string = (date: Date = new Date(), formater: string = ISO_FORMAT): string => moment(date).utc().format(formater);

export default (date: Date = new Date()): Date => moment(date, moment.ISO_8601).utc().toDate();
