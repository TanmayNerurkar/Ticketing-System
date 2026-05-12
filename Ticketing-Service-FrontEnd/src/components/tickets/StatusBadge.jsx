import { STATUS_CONFIG } from '../../lib/constants';

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.OPEN;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.dot }}
      />
      {config.label}
    </span>
  );
}