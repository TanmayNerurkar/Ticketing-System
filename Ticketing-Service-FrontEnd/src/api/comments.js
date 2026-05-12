import { apiFetch } from './client';

export const listComments = (ticketId) =>
  apiFetch(`/tickets/${ticketId}/comments`);

export const addComment = (ticketId, body, internal = false) =>
  apiFetch(`/tickets/${ticketId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body, internal }),
  });