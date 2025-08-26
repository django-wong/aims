import axios, { AxiosResponse } from 'axios';
import { toast } from 'sonner';
import * as packageInfo from '../../package.json';

axios.interceptors.request.use((config) => {
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  config.headers['X-Version'] = packageInfo.version;

  if (! config.headers['Accept']) {
    config.headers['Accept'] = 'application/json';
  }
  return config;
})

function handleResponse(response: AxiosResponse, isError = false) {
  if (response.data) {
    if (typeof response.data.message === 'string') {
      (isError ? toast.error : toast.success)(
        response.data.message
      );
    }

    if (typeof response.data.error === 'string') {
      toast.error(
        response.data.error
      );
    }
  }
}

axios.interceptors.response.use((response) => {
  handleResponse(response);
  return response;
}, (error) => {
  if (error.response) {
    handleResponse(error.response, true);
  }
  throw error;
});
