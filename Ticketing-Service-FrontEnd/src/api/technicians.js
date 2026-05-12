import { apiFetch } from './client';

export const listTechnicians = () => apiFetch('/technicians');

export const getTechnicianWorkload = (id) =>
  apiFetch(`/technicians/${id}/workload`);

export const updateAvailability = (id, available) =>
  apiFetch(`/technicians/${id}/availability`, {
    method: 'PATCH',
    body: JSON.stringify({ available }),
  });