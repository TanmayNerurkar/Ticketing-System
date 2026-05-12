import { apiFetch } from './client';

export const listUsers = () => apiFetch('/users');
export const getUser = (id) => apiFetch(`/users/${id}`);