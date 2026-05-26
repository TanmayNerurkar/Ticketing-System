import { useQuery } from '@tanstack/react-query';
import * as organizationsApi from '../../api/organizations';

export const useOrganizations = () =>
  useQuery({
    queryKey: ['organizations'],
    queryFn: organizationsApi.listOrganizations,
  });
