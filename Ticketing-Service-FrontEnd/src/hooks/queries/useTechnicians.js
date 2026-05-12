import { useQuery } from '@tanstack/react-query';
import { listTechnicians } from '../../api/technicians';

export const useTechnicians = () =>
  useQuery({
    queryKey: ['technicians'],
    queryFn: listTechnicians,
  });