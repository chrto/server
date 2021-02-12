import axiosUnbound from './axios.unbound';
import axios from 'axios';
import { AxiosStorage } from './axios.types';

const axiosStorage: AxiosStorage = axiosUnbound(axios.create());
export default axiosStorage;
