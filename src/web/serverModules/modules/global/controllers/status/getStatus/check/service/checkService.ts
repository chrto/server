import caseOf from 'utils/monad/either/caseOf/caseOf';
import { ServerStatus, ServiceItem } from 'model/global/serverStatus/serverStatus.types';
import { ServicePing } from './checkService.types';

export default <T> (service: ServicePing<T>, item: ServiceItem) =>
  (status: ServerStatus): Promise<ServerStatus> =>
    service.ping()
      .then(caseOf({
        right: (): boolean => true,
        left: (): boolean => false
      }))
      .then((success: boolean): ServerStatus => ({
        ...status,
        services: {
          ...status.services,
          [item]: success
        }
      }));
