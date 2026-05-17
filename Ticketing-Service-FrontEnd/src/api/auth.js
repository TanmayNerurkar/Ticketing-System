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

export const changePassword = (currentPassword, newPassword) =>
  apiFetch('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

export const forgotPassword = (email) =>
  apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const resetPassword = (token, newPassword) =>
  apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
