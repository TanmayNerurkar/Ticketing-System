export const STATUS_CONFIG = {
  OPEN: {
    label: 'Open',
    dot: '#B45309',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
  },
  ASSIGNED: {
    label: 'Assigned',
    dot: '#1E3A8A',
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    border: 'border-blue-200',
  },
  IN_PROGRESS: {
    label: 'In progress',
    dot: '#0F766E',
    bg: 'bg-teal-50',
    text: 'text-teal-900',
    border: 'border-teal-200',
  },
  WAITING_CLIENT: {
    label: 'Waiting',
    dot: '#6B7280',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
  },
  RESOLVED: {
    label: 'Resolved',
    dot: '#166534',
    bg: 'bg-green-50',
    text: 'text-green-900',
    border: 'border-green-200',
  },
  CLOSED: {
    label: 'Closed',
    dot: '#374151',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
  },
};

export const PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
  },
  MEDIUM: {
    label: 'Medium',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
  },
  HIGH: {
    label: 'High',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
  },
  CRITICAL: {
    label: 'Critical',
    bg: 'bg-red-50',
    text: 'text-red-800',
  },
};

export const ROLES = {
  CLIENT: 'CLIENT',
  TECHNICIAN: 'TECHNICIAN',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
};

export const CONTACT_TIMES = [
  { value: 'MORNING', label: 'Morning (8 AM – 12 PM)' },
  { value: 'AFTERNOON', label: 'Afternoon (12 PM – 5 PM)' },
  { value: 'ANYTIME', label: 'Anytime' },
];

export const TOKEN_KEY = 'lifeline_auth_token';