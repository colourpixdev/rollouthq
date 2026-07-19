import { cn } from '../../lib/utils';

export function RolloutLogo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <svg viewBox="0 0 48 48" role="img" aria-label="RolloutHQ logo" className={cn('h-11 w-11 shrink-0', markClassName)}>
        <rect width="48" height="48" rx="14" fill="#0B1220" />
        <path d="M14 30.5L23.5 21L30 27.5L37 20.5" fill="none" stroke="#14B8A6" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="30.5" r="4.2" fill="#FFFFFF" />
        <circle cx="23.5" cy="21" r="4.2" fill="#14B8A6" />
        <circle cx="30" cy="27.5" r="4.2" fill="#FFFFFF" />
        <circle cx="37" cy="20.5" r="4.2" fill="#14B8A6" />
        <path d="M31 14H38V21" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      </svg>
      <span className="sr-only">RolloutHQ</span>
    </div>
  );
}