import { useQuery } from '@tanstack/react-query';
import {
  fetchClientDashboard,
  fetchTechnicianDashboard,
} from '../../api/dashboards';

export const useClientDashboard = () =>
  useQuery({
    queryKey: ['dashboard', 'client'],
    queryFn: fetchClientDashboard,
  });

export const useTechnicianDashboard = () =>
  useQuery({
    queryKey: ['dashboard', 'technician'],
    queryFn: fetchTechnicianDashboard,
  });