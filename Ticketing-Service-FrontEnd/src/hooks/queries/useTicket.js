import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ticketsApi from '../../api/tickets';
import * as commentsApi from '../../api/comments';

export const useTicket = (id) =>
  useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketsApi.getTicket(id),
    enabled: !!id,
  });

export const useTicketComments = (id) =>
  useQuery({
    queryKey: ['ticket', id, 'comments'],
    queryFn: () => commentsApi.listComments(id),
    enabled: !!id,
  });

export const useAddComment = (ticketId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ body, internal }) =>
      commentsApi.addComment(ticketId, body, internal),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ticket', ticketId, 'comments'] });
    },
  });
};