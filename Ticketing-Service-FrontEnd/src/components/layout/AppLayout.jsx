import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <Outlet />
      </main>
    </div>
  );
}