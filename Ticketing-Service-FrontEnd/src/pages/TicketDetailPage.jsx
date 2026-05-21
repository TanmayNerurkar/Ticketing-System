import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  Send,
  RotateCcw,        // NEW: icon for Reopen
  UserPlus,         // NEW: icon for Assign/Reassign
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import {
  useTicket,
  useTicketComments,
  useAddComment,
} from '../hooks/queries/useTicket';
import { useUpdateTicket } from '../hooks/queries/useTickets';
import { ROLES } from '../lib/constants';
import {
  formatDateTime,
  formatRelativeTime,
  initials,
} from '../lib/formatters';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import StatusBadge from '../components/tickets/StatusBadge';
import PriorityBadge from '../components/tickets/PriorityBadge';
import CommentItem from '../components/tickets/CommentItem';
// NEW: the two modal components
import ReopenTicketModal from '../components/tickets/ReopenTicketModal';
import AssignTicketModal from '../components/tickets/AssignTicketModal';

function DetailRow({ label, children }) {
  return (
    <div>
      <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-1.5">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [comment, setComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [showResolveForm, setShowResolveForm] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // NEW: state for the two modals
  const [reopenOpen, setReopenOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const { data: ticket, isLoading, error } = useTicket(id);
  const { data: comments = [] } = useTicketComments(id);
  const addComment = useAddComment(id);
  const updateTicket = useUpdateTicket();

  if (isLoading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="text-sm text-stone-500 mt-4">Loading ticket...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="p-16 text-center">
        <AlertTriangle size={32} className="mx-auto text-stone-400 mb-3" />
        <p className="text-sm text-stone-600">
          {error?.message || 'Ticket not found'}
        </p>
        <Button
          variant="secondary"
          onClick={() => navigate('/tickets')}
          className="mt-4"
        >
          Back to tickets
        </Button>
      </div>
    );
  }

  // NEW: derive permission flags after ticket is loaded
  const isAdmin = user?.role === ROLES.ADMIN;
  const isReporter = user?.id === ticket?.reporter?.id;
  const isResolved =
    ticket?.status === 'RESOLVED' || ticket?.status === 'CLOSED';
  const canReopen = isResolved && (isReporter || isAdmin);
  const canReassign = !isResolved && isAdmin;

  const canResolve =
    user?.role !== ROLES.CLIENT &&
    !['RESOLVED', 'CLOSED'].includes(ticket.status);

  const handleAddComment = () => {
    if (!comment.trim()) return;
    addComment.mutate(
      { body: comment.trim(), internal: isInternal },
      {
        onSuccess: () => {
          setComment('');
          setIsInternal(false);
          toast.success('Comment added');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleResolve = () => {
    if (!resolutionNotes.trim()) {
      toast.warning('Please add resolution notes');
      return;
    }
    updateTicket.mutate(
      {
        id,
        body: { status: 'RESOLVED', resolutionNotes: resolutionNotes.trim() },
      },
      {
        onSuccess: () => {
          toast.success('Ticket marked as resolved');
          setShowResolveForm(false);
          setResolutionNotes('');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <>
      <div className="border-b border-stone-200 bg-stone-50">
        <div className="px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 mb-3 transition-colors"
          >
            <ArrowLeft size={12} /> Back
          </button>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs text-stone-500 font-mono tracking-wider">
                  {ticket.ticketNumber}
                </span>
                <span className="text-stone-300">·</span>
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
              <h1 className="text-3xl font-display font-normal text-stone-900 leading-tight tracking-tight">
                {ticket.title}
              </h1>
            </div>

            {/* NEW: action buttons stacked next to the heading */}
            <div className="flex items-center gap-2">
              {canReassign && (
                <Button
                  variant="secondary"
                  icon={UserPlus}
                  onClick={() => setAssignOpen(true)}
                >
                  {ticket.assignee ? 'Reassign' : 'Assign'}
                </Button>
              )}
              {canReopen && (
                <Button
                  variant="secondary"
                  icon={RotateCcw}
                  onClick={() => setReopenOpen(true)}
                >
                  Reopen ticket
                </Button>
              )}
              {canResolve && (
                <Button icon={CheckCircle2} onClick={() => setShowResolveForm(true)}>
                  Mark resolved
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 max-w-6xl">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start gap-3 mb-3">
              <Avatar initials={initials(ticket.reporter?.fullName)} size="md" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-900">
                  {ticket.reporter?.fullName}
                </div>
                <div className="text-xs text-stone-500">
                  Reported {formatDateTime(ticket.createdAt)}
                </div>
              </div>
            </div>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap break-words">
              {ticket.description}
            </p>
            {ticket.blockingWork && (
              <div className="mt-4 flex items-center gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                <AlertTriangle size={12} />
                Reporter indicated this is blocking their work.
              </div>
            )}
            {ticket.resolutionNotes && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
                <div className="text-[10px] text-green-700 uppercase tracking-widest font-medium mb-1.5">
                  Resolution
                </div>
                <p className="text-sm text-green-900 whitespace-pre-wrap">
                  {ticket.resolutionNotes}
                </p>
              </div>
            )}
          </Card>

          {showResolveForm && (
            <Card className="bg-green-50 border-green-200">
              <h3 className="text-sm font-medium text-stone-900 mb-3">
                Resolve ticket
              </h3>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Describe how the issue was resolved..."
                rows={3}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 resize-none"
              />
              <div className="flex justify-end gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowResolveForm(false);
                    setResolutionNotes('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  loading={updateTicket.isPending}
                  onClick={handleResolve}
                >
                  Confirm resolution
                </Button>
              </div>
            </Card>
          )}

          <div>
            <div className="border-b border-stone-200 flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 pb-2.5 -mb-px text-sm text-stone-900 border-b-2 border-stone-900 font-medium">
                <MessageSquare size={13} />
                Conversation
                <span className="text-xs text-stone-400">{comments.length}</span>
              </div>
            </div>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-sm text-stone-500 text-center py-8">
                  No comments yet. Start the conversation below.
                </p>
              ) : (
                comments.map((c) => <CommentItem key={c.id} comment={c} />)
              )}

              <Card padding="sm">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type a reply..."
                  rows={3}
                  className="w-full text-sm text-stone-900 placeholder-stone-400 focus:outline-none resize-none p-2"
                />
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  {user?.role !== ROLES.CLIENT ? (
                    <label className="text-xs text-stone-500 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                      />
                      Internal note
                    </label>
                  ) : (
                    <span />
                  )}
                  <Button
                    icon={Send}
                    size="sm"
                    disabled={!comment.trim()}
                    loading={addComment.isPending}
                    onClick={handleAddComment}
                  >
                    Send
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <DetailRow label="Status">
            <StatusBadge status={ticket.status} />
          </DetailRow>
          <DetailRow label="Priority">
            <PriorityBadge priority={ticket.priority} />
          </DetailRow>
          <DetailRow label="Assignee">
            {ticket.assignee ? (
              <div className="flex items-center gap-2">
                <Avatar initials={initials(ticket.assignee.fullName)} size="sm" />
                <span className="text-sm text-stone-900">
                  {ticket.assignee.fullName}
                </span>
              </div>
            ) : (
              <span className="text-sm text-stone-500 italic">Unassigned</span>
            )}
          </DetailRow>
          <DetailRow label="Reporter">
            <div className="flex items-center gap-2">
              <Avatar initials={initials(ticket.reporter?.fullName)} size="sm" />
              <span className="text-sm text-stone-900">
                {ticket.reporter?.fullName}
              </span>
            </div>
          </DetailRow>
          <DetailRow label="Organization">
            <span className="text-sm text-stone-900">
              {ticket.organization?.name}
            </span>
          </DetailRow>
          <DetailRow label="Category">
            <span className="text-sm text-stone-900">
              {ticket.category || 'Uncategorized'}
            </span>
            {ticket.subcategory && (
              <span className="text-xs text-stone-500 block mt-0.5">
                {ticket.subcategory}
              </span>
            )}
          </DetailRow>
          <DetailRow label="SLA due">
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-stone-500" />
              <span className="text-sm text-stone-900">
                {formatDateTime(ticket.slaDueAt)}
              </span>
            </div>
          </DetailRow>
          {ticket.bestContactTime && (
            <DetailRow label="Best contact time">
              <span className="text-sm text-stone-900 capitalize">
                {ticket.bestContactTime.toLowerCase()}
              </span>
            </DetailRow>
          )}
          {ticket.resolvedAt && (
            <DetailRow label="Resolved">
              <span className="text-sm text-stone-900">
                {formatRelativeTime(ticket.resolvedAt)}
              </span>
            </DetailRow>
          )}
        </aside>
      </div>

      {/* NEW: the two modals mounted at the end so they overlay everything */}
      <ReopenTicketModal
        ticketId={ticket.id}
        isOpen={reopenOpen}
        onClose={() => setReopenOpen(false)}
      />
      <AssignTicketModal
        ticketId={ticket.id}
        currentAssigneeId={ticket.assignee?.id}
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
      />
    </>
  );
}