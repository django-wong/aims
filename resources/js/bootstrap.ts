import axios from 'axios';
import { toast } from 'sonner';

axios.interceptors.request.use((config) => {
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  if (! config.headers['Accept']) {
    config.headers['Accept'] = 'application/json';
  }
  return config;
})

axios.interceptors.response.use((response) => {
  if (response.data && response.data.message) {
    if (typeof response.data.message === 'string') {
      toast.success(response.data.message);
    }
    if (typeof response.data.error === 'string') {
      toast.error(response.data.error);
    }
  }
  return response;
});
