import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMessageStore } from "../store/messageStore";
import { getSocket, connectSocket } from "../lib/socket";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../pages/ChatWindow";
import UserPicker from "../components/UserPicker";

export default function Conversations() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { fetchConversations, openConversation, receiveMessage, clearActiveConversation } =
    useMessageStore();
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    fetchConversations();
    connectSocket();

    const socket = getSocket();
    socket.on("newMessage", receiveMessage);

    return () => {
      socket.off("newMessage", receiveMessage);
    };
  }, []);

  useEffect(() => {
    if (conversationId) {
      openConversation(conversationId);
    } else {
      clearActiveConversation();
    }
  }, [conversationId]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[var(--color-bg)]">
      <div className="w-full md:w-80 border-r border-[var(--color-border)] flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-[var(--color-border)]">
          <button
            onClick={() => setPickerOpen(true)}
            className="w-full bg-[var(--color-primary)] text-white font-[IBM_Plex_Mono] text-xs uppercase tracking-wide rounded-md py-2 hover:opacity-90"
          >
            New Message
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ConversationList
            activeId={conversationId}
            onSelect={(id) => navigate(`/messages/${id}`)}
          />
        </div>
      </div>

      <div className="hidden md:flex flex-1">
        {conversationId ? (
          <ChatWindow conversationId={conversationId} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-[Fraunces] text-lg text-[var(--color-muted)]">
              Select a conversation
            </p>
          </div>
        )}
      </div>

      {pickerOpen && <UserPicker onClose={() => setPickerOpen(false)} />}
    </div>
  );
}