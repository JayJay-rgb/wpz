import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGigStore } from "../store/gigStore";

function formatBudget(budget) {
  if (!budget) return "Budget not set";
  const { min, max } = budget;
  if (min != null && max != null) return `$${min} – $${max}`;
  if (min != null) return `From $${min}`;
  if (max != null) return `Up to $${max}`;
  return "Budget not set";
}

const statusStyles = {
  open: "border-[var(--color-border)] text-[var(--color-muted)]",
  "in progress": "border-[var(--color-primary)] text-[var(--color-primary)]",
  completed: "border-green-600 text-green-600",
  cancelled: "border-red-500 text-red-500",
};

export default function MyGigs() {
  const { myGigs, myGigsLoading, fetchMyGigs, cancelGig, completeGig } = useGigStore();

  useEffect(() => {
    fetchMyGigs();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Cancel this gig? Pending bids will be rejected.")) return;
    try {
      await cancelGig(id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComplete = async (id) => {
    if (!confirm("Mark this gig as completed?")) return;
    try {
      await completeGig(id);
    } catch (err) {
      console.log(err);
    }
  };

  if (myGigsLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg border border-[var(--color-border)] animate-pulse bg-[var(--color-surface)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-[Fraunces] text-2xl mb-6">My Gigs</h1>

      {myGigs.length === 0 && (
        <div className="text-center py-20">
          <p className="font-[Fraunces] text-xl mb-2">No gigs posted yet</p>
          <Link
            to="/gigs/new"
            className="font-[IBM_Plex_Mono] text-xs uppercase text-[var(--color-primary)]"
          >
            Post your first gig →
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {myGigs.map((g) => (
          <div key={g._id} className="border border-[var(--color-border)] rounded-lg p-5 bg-[var(--color-surface)]">
            <div className="flex justify-between items-start gap-4 mb-2">
              <Link to={`/gigs/${g._id}`} className="font-[Fraunces] text-lg hover:text-[var(--color-primary)]">
                {g.title}
              </Link>
              <span className={`font-[IBM_Plex_Mono] text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 border whitespace-nowrap ${statusStyles[g.status] || ""}`}>
                {g.status}
              </span>
            </div>

            <p className="font-[IBM_Plex_Mono] text-sm text-[var(--color-primary)] mb-3">
              {formatBudget(g.budget)}
            </p>

            {g.status === "open" && (
              <button
                onClick={() => handleCancel(g._id)}
                className="font-[IBM_Plex_Mono] text-xs uppercase text-red-500 hover:opacity-80"
              >
                Cancel gig
              </button>
            )}

            {g.status === "in progress" && (
              <button
                onClick={() => handleComplete(g._id)}
                className="font-[IBM_Plex_Mono] text-xs uppercase text-green-600 hover:opacity-80"
              >
                Mark as completed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}