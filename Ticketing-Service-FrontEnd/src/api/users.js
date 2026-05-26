import { apiFetch } from './client';

export const listUsers = () => apiFetch('/users');

export const createUser = (data) =>
  apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateUser = (id, data) =>
  apiFetch(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const resetUserPassword = (id) =>
  apiFetch(`/users/${id}/reset-password`, {
    method: 'POST',
  });
