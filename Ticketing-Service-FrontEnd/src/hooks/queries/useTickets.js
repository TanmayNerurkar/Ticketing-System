import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ticketsApi from '../../api/tickets';

export const useTickets = (filters) =>
  useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketsApi.listTickets(filters),
    keepPreviousData: true,
  });

export const useCreateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ticketsApi.createTicket,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tickets'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => ticketsApi.updateTicket(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['tickets'] });
      qc.invalidateQueries({ queryKey: ['ticket', id] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};