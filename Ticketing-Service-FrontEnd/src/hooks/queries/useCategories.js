import { useQuery } from '@tanstack/react-query';
import { listCategories } from '../../api/categories';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
    staleTime: 60 * 60 * 1000, // 1 hour
  });