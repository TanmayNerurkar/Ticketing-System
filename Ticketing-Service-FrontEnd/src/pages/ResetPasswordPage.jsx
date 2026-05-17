import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import * as authApi from '../api/auth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      setDone(true);
    } catch (err) {
      setError(err?.problem?.detail || err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-9 h-9 bg-stone-900 rounded flex items-center justify-center">
            <Stethoscope size={18} className="text-stone-50" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-lg font-display font-medium text-stone-900 leading-tight tracking-tight">
              Lifeline
            </div>
            <div className="text-[10px] text-stone-500 uppercase tracking-widest">
              IT for Healthcare
            </div>
          </div>
        </div>

        {!token ? (
          <>
            <h1 className="text-3xl font-display font-normal text-stone-900 mb-2 tracking-tight">
              Invalid link.
            </h1>
            <p className="text-sm text-stone-600 mb-8">
              This password reset link is missing or malformed. Please request a new one.
            </p>
            <Link to="/forgot-password">
              <Button variant="secondary" fullWidth>
                Request a new link
              </Button>
            </Link>
          </>
        ) : done ? (
          <>
            <h1 className="text-3xl font-display font-normal text-stone-900 mb-2 tracking-tight">
              Password reset.
            </h1>
            <p className="text-sm text-stone-600 mb-8">
              Your password has been updated. You can now sign in with your new password.
            </p>
            <Button fullWidth onClick={() => navigate('/login')}>
              Go to sign in
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1 className="text-3xl font-display font-normal text-stone-900 mb-2 tracking-tight">
              Set a new password.
            </h1>
            <p className="text-sm text-stone-600 mb-8">
              Choose a strong password you have not used before.
            </p>
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  {error}
                </div>
              )}
              <Input
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                hint="At least 8 characters"
              />
              <Input
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <Button type="submit" loading={loading} fullWidth>
                Reset password
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
