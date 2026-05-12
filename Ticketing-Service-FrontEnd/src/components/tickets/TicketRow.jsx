import { ChevronRight } from 'lucide-react';
import Avatar from '../ui/Avatar';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { formatRelativeTime, initials } from '../../lib/formatters';

export default function TicketRow({ ticket, onOpen, isLast }) {
  return (
    <button
      onClick={() => onOpen(ticket)}
      className={`w-full text-left flex items-start gap-4 p-4 hover:bg-stone-50 transition-colors ${
        !isLast ? 'border-b border-stone-100' : ''
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <Avatar initials={initials(ticket.reporter?.fullName)} size="md" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] text-stone-500 tracking-wider font-mono">
            {ticket.ticketNumber}
          </span>
          {ticket.category && (
            <>
              <span className="text-stone-300">·</span>
              <span className="text-[11px] text-stone-500">
                {ticket.category}
              </span>
            </>
          )}
        </div>
        <div className="text-sm font-medium text-stone-900 mb-1 leading-tight line-clamp-1">
          {ticket.title}
        </div>
        <div className="text-xs text-stone-500 line-clamp-1">
          {ticket.description}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
        <div className="text-[11px] text-stone-400">
          {formatRelativeTime(ticket.createdAt)}
        </div>
      </div>

      <ChevronRight size={14} className="text-stone-300 mt-1 flex-shrink-0" />
    </button>
  );
}