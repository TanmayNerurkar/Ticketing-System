import { apiFetch } from './client';

export const fetchClientDashboard = () => apiFetch('/dashboards/client');
export const fetchTechnicianDashboard = () =>
  apiFetch('/dashboards/technician');