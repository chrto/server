import { Version } from 'utils/version';
import { DatabaseState, ServiceItem } from './serverStatus.types';

export default (version: Version) => ({
  buildNumber: version.getBuildNumber(),
  version: version.getVersion(),
  host: version.getHostname(),
  db: DatabaseState.Down,
  services: {
    [ServiceItem.sso]: false
  },
  allSystemsWorking: false
});
