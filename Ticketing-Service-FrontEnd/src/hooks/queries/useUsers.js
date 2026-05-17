import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as usersApi from '../../api/users';

export const useUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: usersApi.listUsers,
  });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => usersApi.updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useResetUserPassword = () =>
  useMutation({
    mutationFn: usersApi.resetUserPassword,
  });
