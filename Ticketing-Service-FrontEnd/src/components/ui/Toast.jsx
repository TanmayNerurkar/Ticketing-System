import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const TOAST_STYLES = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    icon: CheckCircle2,
    iconColor: 'text-green-600',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    icon: AlertCircle,
    iconColor: 'text-red-600',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    icon: Info,
    iconColor: 'text-blue-600',
  },
};

export default function Toast({ message, type = 'info', onClose }) {
  const style = TOAST_STYLES[type];
  const Icon = style.icon;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 ${style.bg} ${style.border} border rounded-lg shadow-lg px-4 py-3 min-w-[320px] max-w-md animate-slide-in-right`}
    >
      <Icon size={18} className={`${style.iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`flex-1 text-sm ${style.text}`}>{message}</p>
      <button
        onClick={onClose}
        className={`${style.text} hover:opacity-70 transition-opacity`}
      >
        <X size={14} />
      </button>
    </div>
  );
}