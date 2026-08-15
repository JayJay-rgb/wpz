import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore, TYPE_LABELS } from "../store/notificationStore";
import { useAuthStore } from "../store/authStore";
import { getSocket, connectSocket } from "../lib/socket";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function NotificationBell() {
  const { notifications, fetchNotifications, markRead, receiveNotification, unreadCount } =
    useNotificationStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) return;

    fetchNotifications();
    connectSocket();

    const socket = getSocket();
    socket.on("newNotification", receiveNotification);

    return () => {
      socket.off("newNotification", receiveNotification);
    };
  }, [accessToken]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (n) => {
    if (!n.read) markRead(n._id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const count = unreadCount();

  if (!accessToken) {
    return (
      <button
        className="relative p-2 rounded-md opacity-40 cursor-not-allowed"
        aria-label="Notifications"
        disabled
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>
    );
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-md hover:bg-[var(--color-surface)] transition-colors"
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {count > 0 && (
          <span className="absolute top-0 right-0 bg-[var(--color-primary)] text-white text-[10px] font-[IBM_Plex_Mono] rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <h3 className="font-[Fraunces] text-base">Notifications</h3>
          </div>

          {notifications.length === 0 && (
            <p className="px-4 py-6 text-center font-[Manrope] text-sm text-[var(--color-muted)]">
              Nothing yet.
            </p>
          )}

          {notifications.map((n) => (
            <button
              key={n._id}
              onClick={() => handleClick(n)}
              className={`w-full text-left px-4 py-3 border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg)] transition-colors ${
                !n.read ? "bg-[var(--color-bg)]" : ""
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-1">
                <span className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-primary)]">
                  {TYPE_LABELS[n.type] || n.type}
                </span>
                <span className="font-[IBM_Plex_Mono] text-[10px] text-[var(--color-muted)] whitespace-nowrap">
                  {timeAgo(n.createdAt)}
                </span>
              </div>
              <p className="font-[Manrope] text-sm">
                {n.message}
                {!n.read && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] ml-2 align-middle" />
                )}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}