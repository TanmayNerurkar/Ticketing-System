export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  type = 'button',
  icon: Icon,
  iconRight: IconRight,
  className = '',
  fullWidth = false,
  loading = false,
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-stone-900 text-stone-50 hover:bg-stone-800 active:bg-stone-950',
    secondary:
      'bg-white text-stone-900 border border-stone-300 hover:bg-stone-50 active:bg-stone-100',
    ghost: 'text-stone-700 hover:bg-stone-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    success: 'bg-green-700 text-white hover:bg-green-800',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 rounded',
    md: 'text-sm px-3.5 py-2 rounded',
    lg: 'text-sm px-5 py-2.5 rounded',
  };

  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        Icon && <Icon size={iconSize} strokeWidth={2} />
      )}
      {children}
      {IconRight && !loading && <IconRight size={iconSize} strokeWidth={2} />}
    </button>
  );
}