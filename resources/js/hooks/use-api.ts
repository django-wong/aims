import { headers } from '@/lib/utils';
import { BaseModel } from '@/types';

export function useApi<T extends BaseModel>(base: string) {
  return {
    post: (entity: T) => {
      return fetch(new URL(base, window.location.origin), {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(entity),
      });
    },
    put: (entity: T) => {
      return fetch(new URL(String(entity.id), new URL(base, window.location.origin)), {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(entity),
      });
    },
    get: (params?: URLSearchParams) => {
      return fetch(new URL('?' + (params?.toString() || ''), new URL(base, window.location.origin)), {
        method: 'GET',
        headers: headers(),
      });
    },
    delete: (entity: T) => {
      return fetch(new URL(String(entity.id), new URL(base, window.location.origin)), {
        method: 'DELETE',
        headers: headers(),
      });
    }
  };
}
