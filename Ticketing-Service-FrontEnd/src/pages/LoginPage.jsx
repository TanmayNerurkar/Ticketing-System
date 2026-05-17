import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <div className="flex-1 flex items-center justify-center p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
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

          <h1 className="text-4xl font-display font-normal text-stone-900 mb-2 tracking-tight">
            Sign in.
          </h1>
          <p className="text-sm text-stone-600 mb-8">
            Access your hospital&rsquo;s support portal to raise and track tickets.
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
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <Button type="submit" loading={loading} fullWidth>
              Sign in
            </Button>

            <Link
              to="/forgot-password"
              className="block text-center text-sm text-stone-600 hover:text-stone-900"
            >
              Forgot password?
            </Link>

          </div>
        </form>
      </div>

      <div className="flex-1 bg-stone-900 hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative">
          <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">
            For healthcare teams
          </div>
        </div>
        <div className="relative">
          <blockquote className="text-3xl font-display font-light text-stone-100 leading-snug max-w-md tracking-tight">
            &ldquo;In remote clinics, every minute of system downtime is a minute a
            patient waits. Lifeline keeps us moving.&rdquo;
          </blockquote>
          <div className="mt-6 text-stone-400 text-sm">
            <div className="font-medium text-stone-200">Dr. Aisha Patel</div>
            <div>Chief Medical Officer, Northern Hills Hospital</div>
          </div>
        </div>
        <div className="relative flex items-end justify-between text-[10px] text-stone-500 uppercase tracking-widest">
          <span>Encrypted &middot; ISO 27001</span>
          <span>v 1.0</span>
        </div>
      </div>
    </div>
  );
}