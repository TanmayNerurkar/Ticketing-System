import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import * as authApi from '../api/auth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
    } catch {
      // Same neutral response either way - no email enumeration
    } finally {
      setLoading(false);
      setSubmitted(true);
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

        {submitted ? (
          <>
            <h1 className="text-3xl font-display font-normal text-stone-900 mb-2 tracking-tight">
              Check your email.
            </h1>
            <p className="text-sm text-stone-600 mb-8">
              If an account exists for <span className="font-medium">{email}</span>, we have sent a
              password reset link. It will expire in 30 minutes.
            </p>
            <Link to="/login">
              <Button variant="secondary" fullWidth>
                Back to sign in
              </Button>
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1 className="text-3xl font-display font-normal text-stone-900 mb-2 tracking-tight">
              Forgot password?
            </h1>
            <p className="text-sm text-stone-600 mb-8">
              Enter your account email and we will send you a link to reset your password.
            </p>
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hospital.org"
                required
                autoComplete="email"
              />
              <Button type="submit" loading={loading} fullWidth>
                Send reset link
              </Button>
              <Link
                to="/login"
                className="block text-center text-sm text-stone-600 hover:text-stone-900"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
