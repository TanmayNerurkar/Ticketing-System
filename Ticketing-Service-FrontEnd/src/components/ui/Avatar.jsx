export default function Avatar({ initials, size = 'md', className = '' }) {
  const sizes = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-14 h-14 text-base',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-semibold flex-shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}