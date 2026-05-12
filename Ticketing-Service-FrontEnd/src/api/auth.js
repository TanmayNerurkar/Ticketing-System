import { apiFetch, setToken, clearToken } from './client';

export const login = async (email, password) => {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.token) setToken(data.token);
  return data;
};

export const fetchMe = () => apiFetch('/auth/me');

export const logout = async () => {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    clearToken();
  }
};