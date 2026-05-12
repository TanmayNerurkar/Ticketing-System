import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, error, options = [], className = '', ...props },
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
        <select
          ref={ref}
          {...props}
          className={`w-full px-3 py-2 pr-9 bg-white border ${
            error ? 'border-red-400' : 'border-stone-300'
          } rounded text-sm text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors appearance-none cursor-pointer ${className}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none"
        />
      </div>
      {error && (
        <span className="block text-xs text-red-600 mt-1">{error}</span>
      )}
    </label>
  );
});

export default Select;