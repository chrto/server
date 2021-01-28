
import { asyncLift, lift } from 'utils/either';
import { Response } from 'express';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { ServerStatus, ServiceItem } from 'model/global/serverStatus/serverStatus.types';
import { AsyncStartStop } from 'model/sequelize/modelFactory/modelFactory.types';
import { AuthenticationService } from 'service/http/authentication/types';
import { AppRequest } from 'web/serverModules/types';
import { Context as GlobalContext } from '../../../context/context.types';
import { Fcn } from 'common/types';
import { ServicePing } from './check/service/checkService.types';

export default (
  checkDbConnection: Fcn<[Fcn<[], Promise<void>>], Fcn<[ServerStatus], Promise<ServerStatus>>>,
  checkService: Fcn<[ServicePing, ServiceItem], Fcn<[ServerStatus], Promise<ServerStatus>>>,
  checkAllSystemsWorking: Fcn<[ServerStatus], ServerStatus>
) =>
  (serverStatus: ServerStatus) =>
    (authenticationService: AuthenticationService, sdkStartStop: AsyncStartStop) =>
      async (_ctx: GlobalContext, _req: AppRequest, _res: Response): Promise<Either<AppError, ServerStatus>> =>
        Promise.resolve(Either.right<AppError, ServerStatus>(serverStatus))
          .then(asyncLift(checkDbConnection(sdkStartStop.start)))
          .then(asyncLift(checkService(authenticationService, ServiceItem.sso)))
          .then(lift(checkAllSystemsWorking));
