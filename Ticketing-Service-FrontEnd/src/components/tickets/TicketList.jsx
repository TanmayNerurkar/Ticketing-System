import { Ticket } from 'lucide-react';
import TicketRow from './TicketRow';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';

export default function TicketList({ tickets, onOpen, isLoading, emptyMessage = 'No tickets found.' }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-stone-200 rounded p-12 text-center">
        <Spinner className="mx-auto" />
        <p className="text-xs text-stone-500 mt-3">Loading tickets...</p>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <EmptyState
        icon={Ticket}
        title="No tickets"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="bg-white border border-stone-200 rounded overflow-hidden">
      {tickets.map((ticket, idx) => (
        <TicketRow
          key={ticket.id}
          ticket={ticket}
          onOpen={onOpen}
          isLast={idx === tickets.length - 1}
        />
      ))}
    </div>
  );
}