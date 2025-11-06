import { Attachment } from '@/types';
import React from 'react';

const AttachmentContext = React.createContext<Attachment | null>(null);

export const AttachmentProvider = AttachmentContext.Provider;

export const useAttachment = () => {
  return React.useContext(AttachmentContext);
}
