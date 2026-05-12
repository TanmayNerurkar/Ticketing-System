import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, leftIcon: LeftIcon, className = '', ...props },
  ref
) {
  return (
    <label className="block">
      {label && (
        <span className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="relative">
        {LeftIcon && (
          <LeftIcon
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
          />
        )}
        <input
          ref={ref}
          {...props}
          className={`w-full px-3 py-2 ${
            LeftIcon ? 'pl-9' : ''
          } bg-white border ${
            error ? 'border-red-400' : 'border-stone-300'
          } rounded text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors disabled:bg-stone-100 disabled:cursor-not-allowed ${className}`}
        />
      </div>
      {hint && !error && (
        <span className="block text-xs text-stone-500 mt-1">{hint}</span>
      )}
      {error && (
        <span className="block text-xs text-red-600 mt-1">{error}</span>
      )}
    </label>
  );
});

export default Input;