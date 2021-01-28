import authenticationServiceUnbound from './authenticationService.unbound';
import axios from 'axios';

export default authenticationServiceUnbound.apply(null, [axios.create()]);
