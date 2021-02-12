import sendRequestUnbound from './sendRequest.unbound';
import handleAxiosError from '../errorHandler/errorHandler';
import setMethod from '../requestConfig/method/method';
import setUrl from '../requestConfig/url/url';

export default sendRequestUnbound(handleAxiosError, setMethod, setUrl);
