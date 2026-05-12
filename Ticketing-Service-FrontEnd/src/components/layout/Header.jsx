import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import { initials } from '../../lib/formatters';

export default function Header({ title, subtitle, actions }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-stone-200 bg-stone-50 sticky top-0 z-10">
      <div className="px-8 py-5 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {subtitle && (
            <div className="text-[11px] text-stone-500 uppercase tracking-widest mb-1.5">
              {subtitle}
            </div>
          )}
          <h1 className="text-3xl font-display font-normal text-stone-900 leading-none tracking-tight truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {actions}

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-stone-100 rounded transition-colors"
            >
              <Avatar initials={initials(user?.fullName)} size="sm" />
              <ChevronDown size={12} className="text-stone-500" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-stone-200 rounded shadow-lg z-50 overflow-hidden">
                <div className="px-3 py-2.5 border-b border-stone-100">
                  <div className="text-sm font-medium text-stone-900 truncate">
                    {user?.fullName}
                  </div>
                  <div className="text-xs text-stone-500 truncate">
                    {user?.email}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}