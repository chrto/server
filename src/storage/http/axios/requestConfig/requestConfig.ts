import setBody from './body/body';
import setHeader from './headers/header';
import setMethod from './method/method';
import setParams from './params/params';
import setUrl from './url/url';
import { RequestConfig } from './requestConfig.types';

const requestConfig: RequestConfig = { setBody, setHeader, setMethod, setParams, setUrl };
export default requestConfig;
