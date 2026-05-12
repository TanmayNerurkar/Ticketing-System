import { apiFetch } from './client';

export const listTickets = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== '' && v !== 'ALL' && v != null
    )
  );
  const qs = new URLSearchParams(clean).toString();
  return apiFetch(`/tickets${qs ? `?${qs}` : ''}`);
};

export const getTicket = (id) => apiFetch(`/tickets/${id}`);

export const createTicket = (body) =>
  apiFetch('/tickets', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const updateTicket = (id, body) =>
  apiFetch(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });