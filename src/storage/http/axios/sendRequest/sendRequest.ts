import sendRequestUnbound from './sendRequest.unbound';
import handleAxiosError from '../errorHandler/errorHandler';

export default sendRequestUnbound(handleAxiosError);
