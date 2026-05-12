import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 text-xs text-stone-600">
      <span>
        Page <span className="font-medium">{page + 1}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="px-2.5 py-1.5 border border-stone-300 rounded hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="px-2.5 py-1.5 border border-stone-300 rounded hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}