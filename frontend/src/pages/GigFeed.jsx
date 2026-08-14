import { useEffect, useRef, useCallback } from "react";
import { useGigStore } from "../store/gigStore";
import FeedFilterBar from "../components/FeedFilterBar";
import GigCard from "../components/GigCard";

export default function GigFeed() {
  const { gigs, loading, loadingMore, hasMore, fetchGigs } = useGigStore();
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    fetchGigs(true);
  }, []);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading && !loadingMore) {
        fetchGigs(false);
      }
    },
    [hasMore, loading, loadingMore]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.5,
    });
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <FeedFilterBar />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {loading && (
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-lg border border-[var(--color-border)] animate-pulse bg-[var(--color-surface)]"
              />
            ))}
          </div>
        )}

        {!loading && gigs.length === 0 && (
          <div className="text-center py-20">
            <p className="font-[Fraunces] text-xl mb-2">No gigs match yet</p>
            <p className="font-[Manrope] text-sm text-[var(--color-muted)]">
              Try widening your filters or search terms.
            </p>
          </div>
        )}

        {!loading && gigs.length > 0 && (
          <div className="grid gap-4">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}

        <div ref={sentinelRef} className="h-10" />

        {loadingMore && (
          <p className="text-center font-[IBM_Plex_Mono] text-xs text-[var(--color-muted)] py-4">
            Loading more...
          </p>
        )}

        {!hasMore && gigs.length > 0 && (
          <p className="text-center font-[IBM_Plex_Mono] text-xs text-[var(--color-muted)] py-4">
            You've reached the end.
          </p>
        )}
      </div>
    </div>
  );
}