import { AxiosResponse } from 'axios';

export function download(response: AxiosResponse) {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;

  // Get the filename from the Content-Disposition header
  const contentDisposition = response.headers['content-disposition'];
  let name = 'downloaded_file';
  if (contentDisposition) {
    const matches = contentDisposition.match(/filename="?([^";]+)"?/);
    if (matches && matches[1]) {
      name = matches[1];
    }
  }

  link.setAttribute('download', name);
  link.click();
}
