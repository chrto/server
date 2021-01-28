import getLoggedInUser from './getLoggedInUser/getLoggedInUser';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';

export default ({ }: PluginSdkService) =>
  ({ getLoggedInUser });
