import { apiFetch } from './client';

export const requestUploadUrl = (ticketId, fileName, contentType) =>
  apiFetch(`/tickets/${ticketId}/attachments/upload-url`, {
    method: 'POST',
    body: JSON.stringify({ fileName, contentType })
  });

export const confirmUpload = (ticketId, payload) =>
  apiFetch(`/tickets/${ticketId}/attachments`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const getDownloadUrl = (attachmentId) =>
  apiFetch(`/attachments/${attachmentId}/download-url`);

// Direct upload to Azure Blob via SAS URL (skips your backend)
export const uploadToBlob = async (sasUrl, file) => {
  const response = await fetch(sasUrl, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': file.type
    },
    body: file
  });
  if (!response.ok) throw new Error('Upload failed');
};