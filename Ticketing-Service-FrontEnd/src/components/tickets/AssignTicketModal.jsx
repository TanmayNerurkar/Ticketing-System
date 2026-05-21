import { useState, useEffect } from 'react';
import { useReassignTicket } from '../../hooks/queries/useTickets';
import { useUsers } from '../../hooks/queries/useUsers';


export default function AssignTicketModal({ ticketId, currentAssigneeId, isOpen, onClose, onSuccess }) {
  const [selectedId, setSelectedId] = useState(currentAssigneeId || '');
  const [error, setError] = useState('');
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const reassignMutation = useReassignTicket(ticketId);

  useEffect(() => {
    setSelectedId(currentAssigneeId || '');
  }, [currentAssigneeId, isOpen]);

  if (!isOpen) return null;

  const technicians = users.filter(
    (u) => (u.role === 'TECHNICIAN' || u.role === 'MANAGER') && u.isActive,
  );

  const handleSubmit = async () => {
    setError('');
    try {
      const technicianId = selectedId === '' ? null : selectedId;
      await reassignMutation.mutateAsync(technicianId);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not reassign the ticket. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Assign ticket</h2>
        <p className="text-sm text-gray-600 mb-3">
          Choose a technician for this ticket, or unassign it to send it back to the queue.
        </p>
        {usersLoading ? (
          <p className="text-sm text-gray-500">Loading technicians...</p>
        ) : (
          <select
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={reassignMutation.isPending}
          >
            <option value="">— Unassigned —</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>
                {t.fullName} ({t.role.toLowerCase()})
              </option>
            ))}
          </select>
        )}
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={reassignMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={reassignMutation.isPending || usersLoading}
            className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {reassignMutation.isPending ? 'Saving...' : 'Save assignment'}
          </button>
        </div>
      </div>
    </div>
  );
}