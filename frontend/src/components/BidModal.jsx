import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function BidModal({ gigId, onClose, onSuccess }) {
  const [price, setPrice] = useState("");
  const [proposal, setProposal] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!price || !proposal.trim()) {
      setError("Enter a price and proposal.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosInstance.post(`/gig/${gigId}/bid`, {
        price: Number(price),
        proposal: proposal.trim(),
      });
      onSuccess(res.data.bid);
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-[Fraunces] text-xl">Place a Bid</h2>
          <button
            onClick={onClose}
            className="font-[IBM_Plex_Mono] text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)]"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">
            Your Price ($)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="e.g. 250"
          />
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">
            Proposal
          </label>
          <textarea
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            rows={5}
            className="border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)] resize-none"
            placeholder="Explain why you're a good fit for this gig..."
          />
        </div>

        {error && (
          <p className="font-[Manrope] text-sm text-red-500 mb-4">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-[var(--color-primary)] text-white font-[IBM_Plex_Mono] text-sm uppercase tracking-wide rounded-md py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Bid"}
        </button>
      </div>
    </div>
  );
}