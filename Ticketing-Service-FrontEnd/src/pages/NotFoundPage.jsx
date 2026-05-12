import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-8">
      <div className="text-center max-w-md">
        <Compass
          size={48}
          className="mx-auto text-stone-300 mb-4"
          strokeWidth={1.5}
        />
        <h1 className="text-4xl font-display font-normal text-stone-900 mb-2 tracking-tight">
          Page not found.
        </h1>
        <p className="text-sm text-stone-600 mb-6">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <Button onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
      </div>
    </div>
  );
}