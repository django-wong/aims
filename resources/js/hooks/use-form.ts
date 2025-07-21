import { useForm, FieldValues, UseFormProps, SubmitErrorHandler, FieldPath } from 'react-hook-form';
import React, { useState } from 'react';
import { headers } from '@/lib/utils';

type Method = 'POST' | 'PUT' | 'PATCH';
type Body = {
  [key: string]: unknown;
};

interface UseReactiveFormProps<T extends FieldValues> extends UseFormProps<T>{
  url?: URL | string;
  method?: Method;
}

/**
 * Note: form instance can't be used as dependency in useEffect or useMemo hooks,
 * @param props
 */
export function useReactiveForm<T extends FieldValues>(props: UseReactiveFormProps<T> = {}) {
  const form = useForm<T>(props);

  const [method, setMethod] = useState(props.method ?? 'POST' as Method);
  const [url, setUrl] = useState(props.url ?? location.href);

  function send(data: Body): Promise<Response|void> {
    return fetch(url, {
      method: method,
      headers: headers(),
      body: JSON.stringify(data),
    }).then(async res => {
      if (!res.ok) {
        const json = await res.json();
        if (json.errors) {
          for (const [key, value] of Object.entries(json.errors)) {
            form.setError(key as FieldPath<T>, {
              message: Array.isArray(value) ? value.join(', ') : value as string,
              type: 'manual',
            })
          }
        }
      }
      return res;
    }).catch((error) => {
      console.error('Error response:', error);
    })
  }

  return {
    setUrl,
    setMethod,
    submitDisabled: form.formState.isSubmitting || form.formState.disabled,
    ...form,
    submit: (event?: React.FormEvent<HTMLFormElement>) => {
      return new Promise<Response|void>((resolve) => {
        form.handleSubmit(async (data) => {
          const res = await send(data)
          resolve(res);
        }, (error) => {
          console.error('Form submission error:', error);
        })(event);
      });
    },
    validate: (cb: (data: T) => void, ecb?: SubmitErrorHandler<T>) => {
      form.handleSubmit(cb, ecb)();
    }
  };
}
