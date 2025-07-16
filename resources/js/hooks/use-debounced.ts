import { debounce } from 'lodash';
import { useMemo } from 'react';

/**
 * Create a debounced function that can be used to delay the execution of a callback. Example:
 * ```tsx
 * const debouncer = useDebouncer(500);
 *
 * const onChange = (event) => {
 *  debouncer(() => {
 *    post('/api/data', {value: event.target.value});
 *  });
 * }
 *
 * return (
 *  <>
 *    <input onChange={onChange} />
 *  </>
 * );
 *
 *
 * ```
 * @param wait
 */
export function useDebouncer(wait = 300) {
  return useMemo(() => {
    return debounce((callback: () => void) => {
      callback();
    }, wait);
  }, [wait])
}
