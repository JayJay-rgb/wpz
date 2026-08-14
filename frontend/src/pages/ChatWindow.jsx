import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "../store/messageStore";
import { useAuthStore } from "../store/authStore";

export default function ChatWindow({ conversationId }) {
  const { activeConversation, messages, messagesLoading, sendMessage } = useMessageStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const content = input.trim();
    setInput("");
    try {
      await sendMessage(conversationId, content);
    } catch (err) {
      console.log(err);
    }
  };

  const other = activeConversation?.participants?.find((p) => p._id !== user?._id);

  if (messagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="font-[IBM_Plex_Mono] text-xs text-[var(--color-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <h2 className="font-[Fraunces] text-lg">{other?.name || "Conversation"}</h2>
        {activeConversation?.gig?.title && (
          <p className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-primary)]">
            {activeConversation.gig.title}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.map((msg) => {
          const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
          return (
            <div
              key={msg._id}
              className={`max-w-[70%] px-4 py-2 rounded-lg font-[Manrope] text-sm ${
                isMine
                  ? "self-end bg-[var(--color-primary)] text-white"
                  : "self-start bg-[var(--color-surface)] border border-[var(--color-border)]"
              }`}
            >
              {msg.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-[var(--color-border)] p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)]"
        />
        <button
          type="submit"
          className="bg-[var(--color-primary)] text-white font-[IBM_Plex_Mono] text-xs uppercase px-4 rounded-md hover:opacity-90"
        >
          Send
        </button>
      </form>
    </div>
  );
}