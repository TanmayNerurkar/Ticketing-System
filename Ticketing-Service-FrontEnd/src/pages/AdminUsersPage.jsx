import { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Power, KeyRound } from 'lucide-react';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useResetUserPassword,
} from '../hooks/queries/useUsers';
import { useOrganizations } from '../hooks/queries/useOrganizations';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../lib/constants';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';

const ROLE_BADGE = {
  ADMIN:      'bg-purple-50 text-purple-800 border-purple-200',
  MANAGER:    'bg-blue-50 text-blue-800 border-blue-200',
  TECHNICIAN: 'bg-teal-50 text-teal-800 border-teal-200',
  CLIENT:     'bg-stone-100 text-stone-700 border-stone-200',
};

function UserFormModal({ user, onClose }) {
  const isEdit = !!user;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const resetPassword = useResetUserPassword();
  const { data: orgs = [] } = useOrganizations();

  const [form, setForm] = useState({
    email: user?.email || '',
    fullName: user?.fullName || '',
    role: user?.role || 'TECHNICIAN',
    organizationId: user?.organizationId || '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [resetResult, setResetResult] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isEdit) {
        await updateUser.mutateAsync({
          id: user.id,
          data: {
            fullName: form.fullName.trim(),
            role: form.role,
            organizationId: form.organizationId || null,
          },
        });
      } else {
        await createUser.mutateAsync({
          email: form.email.trim(),
          fullName: form.fullName.trim(),
          role: form.role,
          password: form.password,
          organizationId: form.organizationId || null,
        });
      }
      onClose();
    } catch (err) {
      setError(err?.problem?.detail || err?.problem?.title || err.message || 'Failed');
    }
  };

  const onResetPassword = async () => {
    if (!confirm(`Reset password for ${user.email}? This will generate a new temporary password.`)) return;
    setError(null);
    try {
      const result = await resetPassword.mutateAsync(user.id);
      setResetResult(result.newPassword);
    } catch (err) {
      setError(err?.problem?.detail || err?.problem?.title || err.message || 'Failed');
    }
  };

  const roleOptions = Object.values(ROLES).map((r) => ({ value: r, label: r }));
  const orgOptions = [
    { value: '', label: '— None —' },
    ...orgs.map((o) => ({ value: o.id, label: o.name })),
  ];

  const submitting = createUser.isPending || updateUser.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="px-6 py-4 border-b border-stone-200">
          <h2 className="text-lg font-medium text-stone-900">
            {isEdit ? 'Edit user' : 'Create user'}
          </h2>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              {error}
            </div>
          )}

          {resetResult && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm">
              <p className="text-amber-900 font-medium mb-1">New password generated</p>
              <code className="block p-2 bg-white border border-amber-300 rounded font-mono text-stone-900 select-all break-all">
                {resetResult}
              </code>
              <p className="text-xs text-amber-800 mt-2">
                Copy this and share with the user. It will not be shown again.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="user@example.com"
              required
              disabled={isEdit}
            />
            {isEdit && <p className="text-xs text-stone-500 mt-1">Email cannot be changed.</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Full name</label>
            <Input
              type="text"
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Role</label>
            <Select
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
              options={roleOptions}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Organization {form.role === 'CLIENT' && <span className="text-red-600">*</span>}
            </label>
            <Select
              value={form.organizationId}
              onChange={(e) => set('organizationId', e.target.value)}
              options={orgOptions}
            />
            {form.role === 'CLIENT' && (
              <p className="text-xs text-stone-500 mt-1">Required for CLIENT role.</p>
            )}
          </div>

          {!isEdit && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Temporary password</label>
              <Input
                type="text"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder="Min 6 characters"
                required
              />
              <p className="text-xs text-stone-500 mt-1">Share this with the new user.</p>
            </div>
          )}

          {isEdit && (
            <div className="pt-2 border-t border-stone-100">
              <Button
                type="button"
                variant="secondary"
                icon={KeyRound}
                onClick={onResetPassword}
                disabled={resetPassword.isPending}
              >
                Reset password
              </Button>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-stone-200 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} loading={submitting}>
            {isEdit ? 'Save changes' : 'Create user'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { data: users = [], isLoading, isError, error } = useUsers();
  const updateUser = useUpdateUser();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        u.email?.toLowerCase().includes(q) ||
        u.fullName?.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const roleOptions = [
    { value: 'ALL', label: 'All roles' },
    ...Object.values(ROLES).map((r) => ({ value: r, label: r })),
  ];

  const handleToggleActive = async (u) => {
    if (u.id === currentUser?.id) {
      alert('You cannot deactivate yourself.');
      return;
    }
    const action = u.active ? 'Deactivate' : 'Activate';
    if (!confirm(`${action} ${u.email}?`)) return;
    try {
      await updateUser.mutateAsync({ id: u.id, data: { active: !u.active } });
    } catch (err) {
      alert(`Failed: ${err?.problem?.detail || err.message}`);
    }
  };

  return (
    <>
      <Header
        title="Users."
        subtitle={`${filtered.length} of ${users.length} ${users.length === 1 ? 'user' : 'users'}`}
        actions={
          <Button icon={Plus} onClick={() => setShowCreate(true)}>
            New user
          </Button>
        }
      />

      <div className="p-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-64">
            <Input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={Search}
            />
          </div>
          <div className="w-44">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={roleOptions}
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
            Failed to load users: {error?.message || 'Unknown error'}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="bg-white border border-stone-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr className="text-left text-stone-600">
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Organization</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-stone-500">
                      No users match your filters.
                    </td>
                  </tr>
                )}
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-mono text-stone-900">{u.email}</td>
                    <td className="px-4 py-3 text-stone-900">{u.fullName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                          ROLE_BADGE[u.role] || ROLE_BADGE.CLIENT
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {u.organizationName || <span className="text-stone-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {u.active ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-green-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1.5 rounded hover:bg-stone-200 text-stone-600"
                          title="Edit user"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(u)}
                          className={`p-1.5 rounded hover:bg-stone-200 ${
                            u.active ? 'text-stone-600' : 'text-green-700'
                          }`}
                          title={u.active ? 'Deactivate user' : 'Activate user'}
                          disabled={u.id === currentUser?.id}
                        >
                          <Power size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && <UserFormModal onClose={() => setShowCreate(false)} />}
      {editingUser && (
        <UserFormModal user={editingUser} onClose={() => setEditingUser(null)} />
      )}
    </>
  );
}
