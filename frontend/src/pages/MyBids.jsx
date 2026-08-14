import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBidStore } from "../store/bidStore";

const statusStyles = {
  pending: "border-[var(--color-border)] text-[var(--color-muted)]",
  accepted: "border-green-600 text-green-600",
  rejected: "border-red-500 text-red-500",
};

export default function MyBids() {
  const { myBids, myBidsLoading, fetchMyBids } = useBidStore();

  useEffect(() => {
    fetchMyBids();
  }, []);

  if (myBidsLoading) {
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
      <h1 className="font-[Fraunces] text-2xl mb-6">My Bids</h1>

      {myBids.length === 0 && (
        <div className="text-center py-20">
          <p className="font-[Fraunces] text-xl mb-2">No bids placed yet</p>
          <Link
            to="/"
            className="font-[IBM_Plex_Mono] text-xs uppercase text-[var(--color-primary)]"
          >
            Browse open gigs →
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {myBids.map((b) => (
          <div key={b._id} className="border border-[var(--color-border)] rounded-lg p-5 bg-[var(--color-surface)]">
            <div className="flex justify-between items-start gap-4 mb-2">
              <Link
                to={`/gigs/${b.gig?._id}`}
                className="font-[Fraunces] text-lg hover:text-[var(--color-primary)]"
              >
                {b.gig?.title || "Gig no longer available"}
              </Link>
              <span className={`font-[IBM_Plex_Mono] text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 border whitespace-nowrap ${statusStyles[b.status] || ""}`}>
                {b.status}
              </span>
            </div>

            <p className="font-[IBM_Plex_Mono] text-sm text-[var(--color-primary)] mb-2">
              Your bid: ${b.price}
            </p>

            {b.proposal && (
              <p className="font-[Manrope] text-sm text-[var(--color-muted)]">
                {b.proposal}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}