import { apiFetch } from './client';

export const listOrganizations = () => apiFetch('/organizations');
export const getOrganization = (id) => apiFetch(`/organizations/${id}`);