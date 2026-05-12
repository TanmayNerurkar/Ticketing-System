import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Circle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Inbox,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import {
  useClientDashboard,
  useTechnicianDashboard,
} from '../hooks/queries/useDashboard';
import { ROLES } from '../lib/constants';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import TicketList from '../components/tickets/TicketList';

function StatCard({ label, value, icon: Icon, accent = 'bg-stone-100' }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <div
            className={`w-8 h-8 rounded ${accent} flex items-center justify-center`}
          >
            <Icon size={14} className="text-stone-700" strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="text-3xl font-display font-normal text-stone-900 leading-none mb-1.5">
        {value}
      </div>
      <div className="text-xs text-stone-500 uppercase tracking-wider">
        {label}
      </div>
    </Card>
  );
}

function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useClientDashboard();
  const firstName = user?.fullName?.split(' ').slice(-1)[0] || user?.fullName;

  return (
    <>
      <Header
        title={`Good day, ${firstName}.`}
        subtitle={user?.organization?.name}
        actions={
          <Button icon={Plus} onClick={() => navigate('/tickets/new')}>
            Submit ticket
          </Button>
        }
      />

      <div className="p-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <StatCard
            label="Open tickets"
            value={data?.openCount ?? '—'}
            icon={Circle}
            accent="bg-amber-100"
          />
          <StatCard
            label="Awaiting your response"
            value={data?.waitingCount ?? '—'}
            icon={Clock}
            accent="bg-blue-100"
          />
          <StatCard
            label="Resolved this week"
            value={data?.resolvedThisWeek ?? '—'}
            icon={CheckCircle2}
            accent="bg-green-100"
          />
        </div>

        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-display font-medium text-stone-900 tracking-tight">
            Recent tickets
          </h2>
          <button
            onClick={() => navigate('/tickets')}
            className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>

        <TicketList
          tickets={data?.recentTickets}
          isLoading={isLoading}
          emptyMessage="You haven't submitted any tickets yet."
          onOpen={(t) => navigate(`/tickets/${t.id}`)}
        />
      </div>
    </>
  );
}

function TechnicianDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useTechnicianDashboard();

  return (
    <>
      <Header
        title="Your queue."
        subtitle={`${data?.activeCount ?? 0} active tickets`}
      />

      <div className="p-8 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Assigned to you"
            value={data?.activeCount ?? '—'}
            icon={Inbox}
            accent="bg-blue-100"
          />
          <StatCard
            label="Resolved today"
            value={data?.resolvedToday ?? '—'}
            icon={CheckCircle2}
            accent="bg-green-100"
          />
          <StatCard
            label="SLA at risk"
            value={data?.slaAtRisk ?? '—'}
            icon={AlertTriangle}
            accent="bg-red-100"
          />
          <StatCard
            label="Avg. resolution"
            value={data?.avgResolution ?? '—'}
            icon={TrendingUp}
          />
        </div>

        <h2 className="text-xl font-display font-medium text-stone-900 mb-4 tracking-tight">
          Activity this week
        </h2>

        <Card>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-sm text-stone-500">
              Loading chart...
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data?.weeklyChart || []}>
                  <CartesianGrid
                    strokeDasharray="2 2"
                    stroke="#E7E5E4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#78716C"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#78716C"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 11,
                      border: '1px solid #E7E5E4',
                      borderRadius: 4,
                    }}
                  />
                  <Bar dataKey="opened" fill="#1C1917" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="resolved" fill="#A8A29E" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 text-[11px] mt-3 px-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-stone-900 rounded-sm" /> Opened
                </span>
                <span className="flex items-center gap-1.5 text-stone-500">
                  <span className="w-2 h-2 bg-stone-400 rounded-sm" /> Resolved
                </span>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === ROLES.CLIENT) {
    return <ClientDashboard />;
  }
  return <TechnicianDashboard />;
}