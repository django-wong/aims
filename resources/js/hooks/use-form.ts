import { useForm, FieldValues, UseFormProps, SubmitErrorHandler, FieldPath } from 'react-hook-form';
import React, { useState } from 'react';
import { defaultHeaders } from '@/lib/utils';
import { toast } from 'sonner';
import { BaseModel } from '@/types';
import axios from 'axios';

type FormDataConvertible = FormDataEntryValue | number | boolean | Date | Blob | null | undefined | Array<FormDataConvertible> | {
  [key: string]: FormDataConvertible;
};

function composeKey(parentKey: string | null, key: string): string {
  return parentKey ? `${parentKey}[${key}]` : key;
}

export function objectToFormData(obj: Record<string, FormDataConvertible>, formData = new FormData(), parentKey: string | null = null): FormData {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      append(obj[key], formData, composeKey(parentKey, key));
    }
  }
  return formData;
}

function append(value: FormDataConvertible, formData: FormData, key: string) {
  if (value instanceof Date) {
    formData.append(key, value.toISOString());
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => {
      append(item, formData, `${key}[${index}]`);
    });
  } else if (value instanceof File) {
    formData.append(key, value, value.name);
  } else if (value instanceof Blob) {
    formData.append(key, value);
  } else if (typeof value === 'boolean') {
    formData.append(key, value ? '1' : '0');
  } else if (typeof value === 'number') {
    formData.append(key, `${value}`);
  } else if (typeof value === 'string') {
    formData.append(key, value);
  } else if (value === null || value === undefined) {
    formData.append(key, '');
  } else {
    objectToFormData(value, formData, key);
  }
}

export function useResource<T extends BaseModel>(url: string, value?: Partial<T> | null): {
  url: string;
  method: Method;
  actualMethod?: Method;
  defaultValues?: Partial<T>;
} {
  return value?.id
    ? {
        url: url + '/' + value.id,
        method: 'PUT',
        defaultValues: value,
      }
    : {
        url: url,
        method: 'POST',
        defaultValues: value || undefined,
      };
}

export type Method = 'POST' | 'PUT' | 'PATCH';

interface UseReactiveFormProps<T extends FieldValues> extends UseFormProps<T>{
  url?: URL | string;
  method?: Method;
  actualMethod?: Method; // Used for PUT/PATCH requests
  serialize?: (formData: T) => Record<any, any> | FormData | T | null | undefined;
  contentType?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
  [key: string]: any; // Allow additional properties
}

export type ReactForm<T extends FieldValues, R = T> = ReturnType<typeof useReactiveForm<T, R>>;

/**
 * Note: form instance can't be used as a dependency in useEffect or useMemo hooks,
 * @param props
 */
export function useReactiveForm<T extends FieldValues, R = T>(props: UseReactiveFormProps<T> = {}) {

  const form = useForm<T>(props);

  const [method, setMethod] = useState(props.method ?? 'POST' as Method);
  const [url, setUrl] = useState(props.url ?? location.href);

  function send(data: T): Promise<ApiResponse<R> | void> {
    const formData = typeof props.serialize === 'function' ? props.serialize(data) :data;
    const headers = new Headers(
      defaultHeaders({
        'Content-Type': props.contentType || 'application/json',
      }),
    );
    let actualMethod = method;
    if (formData instanceof FormData) {
      headers.delete('Content-Type');
      if (method === 'PUT') {
        actualMethod = 'POST';
        formData.append('_method', 'PUT');
      }
    }

    return (actualMethod === 'POST' ? axios.post : axios.put)(url instanceof URL ? url.toString() : url, formData)
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => {
        if (error.response.data.errors) {
          for (const [key, value] of Object.entries(error.response.data.errors)) {
            form.setError(key as FieldPath<T>, {
              message: Array.isArray(value) ? value[0] : (value as string),
              type: 'manual',
            });
          }
        }

        throw error;
      });
  }

  return {
    setUrl,
    setMethod,
    submitDisabled: form.formState.isSubmitting || form.formState.disabled,
    ...form,
    submit: (event?: React.FormEvent<HTMLFormElement>) => {
      return new Promise<void | ApiResponse<R>>((resolve, reject) => {
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
