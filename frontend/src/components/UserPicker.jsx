import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useMessageStore } from "../store/messageStore";

export default function UserPicker({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const { startConversation } = useMessageStore();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/users/search", {
          params: { query: query.trim() },
        });
        setResults(res.data.users);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = async (userId) => {
    setStarting(true);
    try {
      const conv = await startConversation(userId);
      onClose();
      navigate(`/messages/${conv._id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg w-full max-w-md p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-[Fraunces] text-lg">New Message</h2>
          <button
            onClick={onClose}
            className="font-[IBM_Plex_Mono] text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)]"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name..."
          className="w-full border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)] mb-3"
        />

        {loading && (
          <p className="font-[IBM_Plex_Mono] text-xs text-[var(--color-muted)] px-1">
            Searching...
          </p>
        )}

        {!loading && query.trim().length >= 2 && results.length === 0 && (
          <p className="font-[Manrope] text-sm text-[var(--color-muted)] px-1">
            No users found.
          </p>
        )}

        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          {results.map((u) => (
            <button
              key={u._id}
              onClick={() => handleSelect(u._id)}
              disabled={starting}
              className="text-left px-3 py-2 rounded-md hover:bg-[var(--color-bg)] font-[Manrope] text-sm disabled:opacity-50"
            >
              {u.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}