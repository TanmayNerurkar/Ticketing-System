import { apiFetch } from './client';

export const listCategories = () => apiFetch('/categories');