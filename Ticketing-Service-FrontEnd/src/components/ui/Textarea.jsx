import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, error, hint, className = '', ...props },
  ref
) {
  return (
    <label className="block">
      {label && (
        <span className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wider">
          {label}
        </span>
      )}
      <textarea
        ref={ref}
        {...props}
        className={`w-full px-3 py-2 bg-white border ${
          error ? 'border-red-400' : 'border-stone-300'
        } rounded text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors resize-y min-h-24 ${className}`}
      />
      {hint && !error && (
        <span className="block text-xs text-stone-500 mt-1">{hint}</span>
      )}
      {error && (
        <span className="block text-xs text-red-600 mt-1">{error}</span>
      )}
    </label>
  );
});

export default Textarea;