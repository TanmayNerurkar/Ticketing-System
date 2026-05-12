import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 36,
    xl: 48,
  };

  return (
    <Loader2
      className={`animate-spin text-stone-400 ${className}`}
      size={sizes[size]}
      strokeWidth={2}
    />
  );
}