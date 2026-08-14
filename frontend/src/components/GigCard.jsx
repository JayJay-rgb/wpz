import { Link } from "react-router-dom";

function formatBudget(budget) {
  if (!budget) return "Budget not set";
  const { min, max } = budget;
  if (min != null && max != null) return `$${min} – $${max}`;
  if (min != null) return `From $${min}`;
  if (max != null) return `Up to $${max}`;
  return "Budget not set";
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  return `Posted ${days} days ago`;
}

export default function GigCard({ gig }) {
  return (
    <Link
      to={`/gigs/${gig._id}`}
      className="relative flex flex-col justify-between border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition-colors group"
    >
      {/* perforated ticket edge */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)]" />
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)]" />

      <div className="p-5 border-b border-dashed border-[var(--color-border)]">
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="font-[Fraunces] text-lg leading-tight group-hover:text-[var(--color-primary)] transition-colors">
            {gig.title}
          </h3>
          <span className="font-[IBM_Plex_Mono] text-xs whitespace-nowrap text-[var(--color-primary)]">
            {formatBudget(gig.budget)}
          </span>
        </div>
        <p className="font-[Manrope] text-sm text-[var(--color-muted)] line-clamp-2">
          {gig.description}
        </p>
      </div>

      <div className="px-5 py-3 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(gig.skills || []).slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="font-[IBM_Plex_Mono] text-[10px] uppercase tracking-wide border border-[var(--color-border)] rounded-full px-2 py-0.5"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 font-[IBM_Plex_Mono] text-[10px] text-[var(--color-muted)] uppercase">
          <span>{gig.bidCount} {gig.bidCount === 1 ? "bid" : "bids"}</span>
          <span>{timeAgo(gig.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}