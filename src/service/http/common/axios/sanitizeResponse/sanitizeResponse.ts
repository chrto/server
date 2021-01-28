import { AxiosResponse } from 'axios';

export default <T>(response: AxiosResponse<T>): T => response.data;
