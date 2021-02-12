import logOutUnbound from './logOut.unbound';
import axiosStorage from 'storage/http/axios/axios';
import requestConfig from 'storage/http/axios/requestConfig/requestConfig';
import sanitizeResponse from 'storage/http/axios/sanitizeResponse/sanitizeResponse';

export default logOutUnbound.apply(null, [axiosStorage.getRequest, requestConfig, sanitizeResponse]);
