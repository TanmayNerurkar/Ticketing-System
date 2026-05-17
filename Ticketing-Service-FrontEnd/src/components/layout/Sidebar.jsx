import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  Plus,
  Users,
  KeyRound,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../lib/constants';

export default function Sidebar() {
  const { user } = useAuth();

  const clientNav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/tickets', label: 'My tickets', icon: Ticket },
    { to: '/tickets/new', label: 'Submit ticket', icon: Plus },
  ];

  const staffNav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/tickets', label: 'All tickets', icon: Ticket },
  ];

  const adminNav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/tickets', label: 'All tickets', icon: Ticket },
    { to: '/admin/users', label: 'Users', icon: Users },
  ];

  const items =
    user?.role === ROLES.CLIENT
      ? clientNav
      : user?.role === ROLES.ADMIN
      ? adminNav
      : staffNav;

  const linkClass = ({ isActive }) =>
    `w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
      isActive ? 'bg-stone-900 text-stone-50' : 'text-stone-700 hover:bg-stone-200'
    }`;

  return (
    <aside className="w-60 bg-stone-100 border-r border-stone-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-stone-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-stone-900 rounded flex items-center justify-center">
            <Stethoscope size={16} className="text-stone-50" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-base font-display font-medium text-stone-900 leading-tight tracking-tight">
              Lifeline
            </div>
            <div className="text-[10px] text-stone-500 uppercase tracking-widest">
              IT for Healthcare
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              <Icon size={15} strokeWidth={2} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-stone-200 space-y-0.5">
        <NavLink to="/change-password" className={linkClass}>
          <KeyRound size={15} strokeWidth={2} />
          Change password
        </NavLink>
        <div className="text-[10px] text-stone-500 uppercase tracking-widest px-3 py-1">
          {user?.role}
        </div>
      </div>
    </aside>
  );
}
