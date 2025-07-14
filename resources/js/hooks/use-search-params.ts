import React, { useLayoutEffect } from 'react';

export type ParamKeyValuePair = [string, string];

export type URLSearchParamsInit = string | ParamKeyValuePair[] | Record<string, string | string[]> | URLSearchParams;

export type SetURLSearchParams = (nextInit?: URLSearchParamsInit | ((prev: URLSearchParams) => URLSearchParamsInit)) => void;

export function createSearchParams(init: URLSearchParamsInit = ''): URLSearchParams {
  return new URLSearchParams(
    typeof init === 'string' || Array.isArray(init) || init instanceof URLSearchParams
      ? init
      : Object.keys(init).reduce((memo, key) => {
          const value = init[key];
          return memo.concat(Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]);
        }, [] as ParamKeyValuePair[]),
  );
}

export function getSearchParamsForLocation(locationSearch: string, defaultSearchParams: URLSearchParams | null) {
  const searchParams = createSearchParams(locationSearch);
  if (defaultSearchParams) {
    // Use `defaultSearchParams.forEach(...)` here instead of iterating of
    // `defaultSearchParams.keys()` to work-around a bug in Firefox related to
    // web extensions. Relevant Bugzilla tickets:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1414602
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1023984
    defaultSearchParams.forEach((_, key) => {
      if (!searchParams.has(key)) {
        defaultSearchParams.getAll(key).forEach((value) => {
          searchParams.append(key, value);
        });
      }
    });
  }

  return searchParams;
}

export function useSearchParams(defaultInit?: URLSearchParamsInit): [URLSearchParams, SetURLSearchParams] {
  const defaultSearchParamsRef = React.useRef(createSearchParams(defaultInit));
  const hasSetSearchParamsRef = React.useRef(false);
  const [search, setSearch] = React.useState(window.location.search);

  useLayoutEffect(() => {
    const onpopstate = () => {
      setSearch(window.location.search);
    }
    window.addEventListener('popstate', onpopstate);
    return () => {
      window.removeEventListener(
        'popstate', onpopstate
      );
    }
  })

  const searchParams = React.useMemo(
    () =>
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that, we want those to take precedence; otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      getSearchParamsForLocation(search, hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current),
    [search],
  );

  const setSearchParams = React.useCallback<SetURLSearchParams>(
    (nextInit) => {
      const newSearchParams = createSearchParams(typeof nextInit === 'function' ? nextInit(searchParams) : nextInit);
      hasSetSearchParamsRef.current = true;
      window.history.replaceState(
        window.history.state, '', `${window.location.pathname}?${newSearchParams.toString()}`
      );
      setSearch(window.location.search);
    },
    [searchParams],
  );

  return [searchParams, setSearchParams];
}
