import { useForm, FieldValues, UseFormProps } from 'react-hook-form';
import React from 'react';

type Method = 'POST' | 'PUT' | 'PATCH';
type Body = any;

interface UseReactiveFormProps<T extends FieldValues> extends UseFormProps<T>{
  url?: URL | string;
  method?: Method;
}

export function useReactiveForm<T extends FieldValues>(props: UseReactiveFormProps<T> = {}) {
  const form = useForm<T>({
    ...props,
  });

  function send(data: Body): Promise<Response|void> {
    return fetch(props.url ?? location.href, {
      method: props.method ?? 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(async res => {
      if (!res.ok) {
        const json = await res.json();
        if (json.errors) {
          for (const [key, value] of Object.entries(json.errors)) {
            form.setError(key as any, {
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
    }
  };
}
