export default function Card({ children, className = '', padding = 'md' }) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={`bg-white border border-stone-200 rounded ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
}