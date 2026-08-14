import { useEffect } from "react";
import { useMessageStore } from "../store/messageStore";
import { useAuthStore } from "../store/authStore";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function ConversationList({ activeId, onSelect }) {
  const { conversations, conversationsLoading } = useMessageStore();
  const { user } = useAuthStore();

  if (conversationsLoading) {
    return (
      <div className="p-4 flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 rounded-md bg-[var(--color-surface)] animate-pulse" />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="font-[Manrope] text-sm text-[var(--color-muted)]">
          No conversations yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      {conversations.map((conv) => {
        const other = conv.participants?.find((p) => p._id !== user?._id);
        const isActive = conv._id === activeId;

        return (
          <button
            key={conv._id}
            onClick={() => onSelect(conv._id)}
            className={`w-full text-left px-4 py-3 border-b border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors ${
              isActive ? "bg-[var(--color-surface)]" : ""
            }`}
          >
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-[Manrope] text-sm font-medium">
                {other?.name || "Unknown user"}
              </span>
              <span className="font-[IBM_Plex_Mono] text-[10px] text-[var(--color-muted)]">
                {timeAgo(conv.lastMessage?.sentAt)}
              </span>
            </div>
            {conv.gig?.title && (
              <p className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-primary)] mb-1">
                {conv.gig.title}
              </p>
            )}
            <p className="font-[Manrope] text-xs text-[var(--color-muted)] truncate">
              {conv.lastMessage?.text || "No messages yet"}
            </p>
          </button>
        );
      })}
    </div>
  );
}