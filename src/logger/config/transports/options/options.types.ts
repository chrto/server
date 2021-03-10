import { ConsoleTransportOptions, FileTransportOptions } from 'winston/lib/winston/transports';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export interface TransportOptions {
  console: ConsoleTransportOptions;
  exceptions: FileTransportOptions;
  file: DailyRotateFile.DailyRotateFileTransportOptions;
  splunk: SplunkTransportOptions;
}

export interface SplunkTransportOptions {
  level?: string;           // logging level to use, will show up as the severity field of an event;
  batchInterval?: number;   // automatically flush events after this many milliseconds.When set to a non - positive value, events will be sent one by one.This setting is ignored when non - positive
  maxBatchSize?: number;    // automatically flush events after the size of queued events exceeds this many bytes.This setting is ignored when non - positive
  maxBatchCount?: number;   // automatically flush events after this many events have been queued.Defaults to flush immediately on sending an event.This setting is ignored when non - positive
  splunk: {
    token: string;          // the Splunk HTTP Event Collector token;
    index?: string;         // the index for the events sent to Splunk;
    source?: string;        // the source for the events sent to Splunk;
    sourcetype?: string;    // the sourcetype for the events sent to Splunk;
    maxRetries?: number;    // how many times to retry the splunk logger;
    host?: string;          // the Splunk HTTP Event Collector host;
    port?: number;          // the Splunk HTTP Event Collector port;
    path?: string;          // URL path to use;
    protocol?: string;      // the protocol to use;
    url?: string;           // URL string to pass to url.parse.This will try to set host, path, protocol, port, url.Any of these values will be overwritten if the corresponding property is set on config;
    eventFormatter?: (message: any, severity: any) => void; // formats events, returning an event as a string, function (message, severity);
  };
}
