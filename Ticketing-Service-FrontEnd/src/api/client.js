import { TOKEN_KEY } from '../lib/constants';

const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1';

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token) => sessionStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(status, problem) {
    super(problem?.detail || problem?.title || 'Request failed');
    this.status = status;
    this.problem = problem || {};
  }
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch (networkError) {
    throw new ApiError(0, {
      title: 'Network error',
      detail: 'Cannot reach the server. Check your connection.',
    });
  }

  if (response.status === 401) {
    clearToken();
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new ApiError(401, { title: 'Session expired' });
  }

  if (!response.ok) {
    let problem = {};
    try {
      problem = await response.json();
    } catch {
      problem = { title: 'Request failed', status: response.status };
    }
    throw new ApiError(response.status, problem);
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return null;
}