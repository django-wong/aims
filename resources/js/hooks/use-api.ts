import { BaseModel } from '@/types';
import axios from 'axios';

/**
 * useApi is a custom hook that provides methods to interact with a RESTful API.
 * It allows you to perform CRUD operations (Create, Read, Update, Delete) on a specified base URL.
 *
 * @param base
 */
export function useApi<T extends BaseModel>(base: string) {
  return {
    post: (entity: T) => {
      return axios.post(base, entity);
    },

    put: (entity: T) => {
      return axios.put(`${base}/${String(entity.id)}`, entity);
    },

    get: (params?: URLSearchParams) => {
      return axios.get(base, {
        params: params,
      });
    },

    delete: (entity: T) => {
      return axios.delete(`${base}/${String(entity.id)}`);
    }
  };
}
