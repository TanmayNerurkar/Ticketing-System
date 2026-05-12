import { PRIORITY_CONFIG } from '../../lib/constants';

export default function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.LOW;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}