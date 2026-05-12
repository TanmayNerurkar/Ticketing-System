import Avatar from '../ui/Avatar';
import { formatRelativeTime, initials } from '../../lib/formatters';

export default function CommentItem({ comment }) {
  return (
    <div className="flex gap-3">
      <Avatar initials={initials(comment.author?.fullName)} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-medium text-stone-900">
            {comment.author?.fullName}
          </span>
          {comment.internal && (
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-medium">
              Internal
            </span>
          )}
          <span className="text-xs text-stone-400">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>
        <div
          className={`text-sm leading-relaxed border rounded p-3 ${
            comment.internal
              ? 'bg-amber-50/50 border-amber-100'
              : 'bg-white border-stone-200'
          }`}
        >
          <p className="text-stone-700 whitespace-pre-wrap break-words">
            {comment.body}
          </p>
        </div>
      </div>
    </div>
  );
}