import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTickets } from '../hooks/queries/useTickets';
import { useDebounce } from '../hooks/useDebounce';
import { STATUS_CONFIG, PRIORITY_CONFIG, ROLES } from '../lib/constants';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Pagination from '../components/ui/Pagination';
import TicketList from '../components/tickets/TicketList';

export default function TicketsListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [page, setPage] = useState(0);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useTickets({
    search: debouncedSearch,
    status,
    priority,
    assigneeId: searchParams.get('assigneeId'),
    page,
    size: 20,
    sort: 'createdAt,desc',
  });

  const tickets = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements ?? 0;

  const statusOptions = [
    { value: 'ALL', label: 'All statuses' },
    ...Object.entries(STATUS_CONFIG).map(([value, config]) => ({
      value,
      label: config.label,
    })),
  ];

  const priorityOptions = [
    { value: 'ALL', label: 'All priorities' },
    ...Object.entries(PRIORITY_CONFIG).map(([value, config]) => ({
      value,
      label: config.label,
    })),
  ];

  return (
    <>
      <Header
        title={user?.role === ROLES.CLIENT ? 'Your tickets.' : 'All tickets.'}
        subtitle={`${totalElements} ${totalElements === 1 ? 'result' : 'results'}`}
        actions={
          user?.role === ROLES.CLIENT && (
            <Button icon={Plus} onClick={() => navigate('/tickets/new')}>
              Submit ticket
            </Button>
          )
        }
      />

      <div className="p-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-64">
            <Input
              type="text"
              placeholder="Search by ticket number or title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              leftIcon={Search}
            />
          </div>
          <div className="w-44">
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
              options={statusOptions}
            />
          </div>
          <div className="w-44">
            <Select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(0);
              }}
              options={priorityOptions}
            />
          </div>
        </div>

        <TicketList
          tickets={tickets}
          isLoading={isLoading}
          onOpen={(t) => navigate(`/tickets/${t.id}`)}
          emptyMessage="No tickets match your filters."
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}