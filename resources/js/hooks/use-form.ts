import { useForm, FieldValues, UseFormProps, SubmitErrorHandler, FieldPath } from 'react-hook-form';
import React, { useState } from 'react';
import { defaultHeaders } from '@/lib/utils';
import { toast } from 'sonner';

type Method = 'POST' | 'PUT' | 'PATCH';

interface UseReactiveFormProps<T extends FieldValues> extends UseFormProps<T>{
  url?: URL | string;
  method?: Method;
  serialize?: (formData: T) => BodyInit | null | undefined;
  contentType?: string;
}

/**
 * Note: form instance can't be used as dependency in useEffect or useMemo hooks,
 * @param props
 */
export function useReactiveForm<T extends FieldValues>(props: UseReactiveFormProps<T> = {}) {
  const form = useForm<T>(props);

  const [method, setMethod] = useState(props.method ?? 'POST' as Method);
  const [url, setUrl] = useState(props.url ?? location.href);

  function send(data: T): Promise<Response|void> {
    const formData = (props.serialize || JSON.stringify)(data);
    const headers = new Headers(
      defaultHeaders({
        'Content-Type': props.contentType || 'application/json'
      })
    );
    if (formData instanceof FormData) {
      headers.delete('Content-Type');
    }

    return fetch(url, {
      method: method, headers: headers, body: formData,
    }).then(async res => {
      const json = await res.json();

      if (json.message) {
        toast.success(json.message);
      }

      if (json.error) {
        toast.error(json.error);
      }

      if (!res.ok) {
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
      return new Promise<Response|void>((resolve, reject) => {
        form.handleSubmit(async (data) => {
          const res = await send(data)
          resolve(res);
        }, (error) => {
          console.error('Form submission error:', error);
          reject(error);
        })(event);
      });
    },
    validate: (cb: (data: T) => void, ecb?: SubmitErrorHandler<T>) => {
      form.handleSubmit(cb, ecb)();
    }
  };
}
