import { DatabaseState, ServerStatus } from 'model/global/serverStatus/serverStatus.types';

export default (start: () => Promise<void>) =>
  async (status: ServerStatus): Promise<ServerStatus> =>
    start()
      .then((): ServerStatus => ({ ...status, db: DatabaseState.Up }))
      .catch((): ServerStatus => ({ ...status, db: DatabaseState.Down }));
