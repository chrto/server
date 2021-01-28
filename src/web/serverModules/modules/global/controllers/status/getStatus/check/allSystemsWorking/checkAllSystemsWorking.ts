import { DatabaseState, ServerStatus } from 'model/global/serverStatus/serverStatus.types';

export default (status: ServerStatus): ServerStatus => ({
  ...status,
  allSystemsWorking: status.services.sso && status.db === DatabaseState.Up
});
