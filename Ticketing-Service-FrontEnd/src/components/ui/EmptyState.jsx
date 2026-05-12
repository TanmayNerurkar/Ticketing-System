export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <div className="bg-white border border-stone-200 border-dashed rounded p-12 text-center">
      {Icon && (
        <Icon
          size={24}
          className="mx-auto text-stone-300 mb-3"
          strokeWidth={1.5}
        />
      )}
      {title && (
        <p className="text-sm font-medium text-stone-900 mb-1">{title}</p>
      )}
      {description && (
        <p className="text-sm text-stone-500 mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}