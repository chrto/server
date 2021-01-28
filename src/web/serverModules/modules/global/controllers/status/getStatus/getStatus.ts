import getStatusUnbound from './getStatus.unbound';
import serverStatus from 'model/global/serverStatus/serverStatus';
import checkService from './check/service/checkService';
import checkDbConnection from './check/dbConnection/checkDbConnection';
import checkAllSystemsWorking from './check/allSystemsWorking/checkAllSystemsWorking';

export default getStatusUnbound
  .apply(null, [checkDbConnection, checkService, checkAllSystemsWorking])
  .apply(null, [serverStatus]);
