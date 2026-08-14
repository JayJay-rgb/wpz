import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGigStore } from "../store/gigStore";
import { useAuthStore } from "../store/authStore";
import { useMessageStore } from "../store/messageStore";
import BidModal from "../components/BidModal";

function formatBudget(budget) {
  if (!budget) return "Budget not set";
  const { min, max } = budget;
  if (min != null && max != null) return `$${min} – $${max}`;
  if (min != null) return `From $${min}`;
  if (max != null) return `Up to $${max}`;
  return "Budget not set";
}

export default function GigDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedGig,
    selectedGigBids,
    detailLoading,
    fetchGigDetail,
    clearSelectedGig,
    acceptBid,
  } = useGigStore();
  const { user } = useAuthStore();
  const { startConversation } = useMessageStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [messaging, setMessaging] = useState(false);
  const [messageError, setMessageError] = useState("");

  const [accepting, setAccepting] = useState(null);
  const [acceptError, setAcceptError] = useState("");

  useEffect(() => {
    fetchGigDetail(id);
    return () => clearSelectedGig();
  }, [id]);

  if (detailLoading || !selectedGig) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="h-48 rounded-lg border border-[var(--color-border)] animate-pulse bg-[var(--color-surface)]" />
      </div>
    );
  }

  const gig = selectedGig;
  const isOwnGig = gig.client?._id === user?._id;
  const alreadyBid = selectedGigBids?.some((b) => b.freelancer?._id === user?._id);

  const handleBidSuccess = () => {
    setModalOpen(false);
    setConfirmation("Your bid was submitted.");
    fetchGigDetail(id);
  };

  const handleMessage = async () => {
    setMessageError("");
    setMessaging(true);
    try {
      const conv = await startConversation(gig.client._id, gig._id);
      navigate(`/messages/${conv._id}`);
    } catch (err) {
      setMessageError(err.response?.data?.message || "Couldn't start conversation.");
    } finally {
      setMessaging(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    if (!confirm("Accept this bid? All other bids will be rejected.")) return;
    setAcceptError("");
    setAccepting(bidId);
    try {
      await acceptBid(gig._id, bidId);
      fetchGigDetail(id);
    } catch (err) {
      setAcceptError(err.response?.data?.message || "Couldn't accept bid.");
    } finally {
      setAccepting(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        to="/"
        className="font-[IBM_Plex_Mono] text-xs uppercase text-[var(--color-muted)] hover:text-[var(--color-primary)]"
      >
        ← Back to feed
      </Link>

      <div className="mt-4 border border-[var(--color-border)] rounded-lg p-6 bg-[var(--color-surface)]">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h1 className="font-[Fraunces] text-2xl">{gig.title}</h1>
          <span className="font-[IBM_Plex_Mono] text-sm text-[var(--color-primary)] whitespace-nowrap">
            {formatBudget(gig.budget)}
          </span>
        </div>

        <p className="font-[Manrope] text-sm text-[var(--color-muted)] mb-4">
          Posted by {gig.client?.name || "Unknown"}
        </p>

        <p className="font-[Manrope] text-base leading-relaxed mb-6 whitespace-pre-wrap">
          {gig.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {(gig.skills || []).map((skill) => (
            <span
              key={skill}
              className="font-[IBM_Plex_Mono] text-[10px] uppercase tracking-wide border border-[var(--color-border)] rounded-full px-2 py-0.5"
            >
              {skill}
            </span>
          ))}
        </div>

        {confirmation && (
          <p className="font-[Manrope] text-sm text-green-600 mb-3">{confirmation}</p>
        )}

        {messageError && (
          <p className="font-[Manrope] text-sm text-red-500 mb-3">{messageError}</p>
        )}

        {!isOwnGig && gig.status === "open" && !alreadyBid && (
          <button
            onClick={() => setModalOpen(true)}
            className="w-full bg-[var(--color-primary)] text-white font-[IBM_Plex_Mono] text-sm uppercase tracking-wide rounded-md py-3 hover:opacity-90 transition-opacity"
          >
            Place a Bid
          </button>
        )}

        {isOwnGig && (
          <p className="font-[IBM_Plex_Mono] text-xs uppercase text-[var(--color-muted)] text-center mb-2">
            This is your gig
          </p>
        )}

        {!isOwnGig && alreadyBid && (
          <p className="font-[IBM_Plex_Mono] text-xs uppercase text-[var(--color-muted)] text-center mb-2">
            You've already placed a bid on this gig
          </p>
        )}

        {!isOwnGig && !alreadyBid && gig.status !== "open" && (
          <p className="font-[IBM_Plex_Mono] text-xs uppercase text-[var(--color-muted)] text-center mb-2">
            No longer accepting bids
          </p>
        )}

        {!isOwnGig && (
          <button
            onClick={handleMessage}
            disabled={messaging}
            className="w-full border border-[var(--color-border)] font-[IBM_Plex_Mono] text-sm uppercase tracking-wide rounded-md py-3 hover:border-[var(--color-primary)] transition-colors mt-2 disabled:opacity-50"
          >
            {messaging ? "Starting..." : "Message Client"}
          </button>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-[Fraunces] text-lg mb-3">
          Bids ({selectedGigBids?.length ?? 0})
        </h2>

        {acceptError && (
          <p className="font-[Manrope] text-sm text-red-500 mb-3">{acceptError}</p>
        )}

        {selectedGigBids?.length === 0 && (
          <p className="font-[Manrope] text-sm text-[var(--color-muted)]">
            No bids yet — be the first.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {selectedGigBids?.map((bidItem) => (
            <div
              key={bidItem._id}
              className="border border-[var(--color-border)] rounded-md px-4 py-3"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-[Manrope] text-sm">
                  {bidItem.freelancer?.name || "Freelancer"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-[IBM_Plex_Mono] text-sm text-[var(--color-primary)]">
                    ${bidItem.price}
                  </span>
                  <span
                    className={`font-[IBM_Plex_Mono] text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 border ${
                      bidItem.status === "accepted"
                        ? "border-green-600 text-green-600"
                        : bidItem.status === "rejected"
                        ? "border-red-500 text-red-500"
                        : "border-[var(--color-border)] text-[var(--color-muted)]"
                    }`}
                  >
                    {bidItem.status}
                  </span>
                </div>
              </div>

              {bidItem.proposal && (
                <p className="font-[Manrope] text-sm text-[var(--color-muted)] mb-2">
                  {bidItem.proposal}
                </p>
              )}

              {isOwnGig && gig.status === "open" && bidItem.status === "pending" && (
                <button
                  onClick={() => handleAcceptBid(bidItem._id)}
                  disabled={accepting === bidItem._id}
                  className="font-[IBM_Plex_Mono] text-xs uppercase text-green-600 hover:opacity-80 disabled:opacity-50"
                >
                  {accepting === bidItem._id ? "Accepting..." : "Accept bid"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <BidModal
          gigId={gig._id}
          onClose={() => setModalOpen(false)}
          onSuccess={handleBidSuccess}
        />
      )}
    </div>
  );
}