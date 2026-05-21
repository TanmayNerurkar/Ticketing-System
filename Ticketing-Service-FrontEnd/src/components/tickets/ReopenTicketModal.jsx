import { useState } from 'react';
import { useReopenTicket } from '../../hooks/queries/useTickets';

export default function ReopenTicketModal({ ticketId, isOpen, onClose, onSuccess }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const reopenMutation = useReopenTicket(ticketId);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');
    if (reason.trim().length < 5) {
      setError('Please provide a reason of at least 5 characters.');
      return;
    }
    try {
      await reopenMutation.mutateAsync(reason.trim());
      setReason('');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not reopen the ticket. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Reopen ticket</h2>
        <p className="text-sm text-gray-600 mb-3">
          Tell us why this ticket needs to be reopened. The reason will be added to the ticket history.
        </p>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          rows="4"
          placeholder="The issue came back after the printer was restarted..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={reopenMutation.isPending}
        />
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={reopenMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={reopenMutation.isPending}
            className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {reopenMutation.isPending ? 'Reopening...' : 'Reopen ticket'}
          </button>
        </div>
      </div>
    </div>
  );
}