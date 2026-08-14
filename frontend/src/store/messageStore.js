import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";
import { connectSocket } from "../lib/socket";

export const useMessageStore = create((set, get) => ({
  conversations: [],
  conversationsLoading: false,

  activeConversation: null,
  messages: [],
  messagesLoading: false,

  fetchConversations: async () => {
    set({ conversationsLoading: true });
    try {
      const res = await axiosInstance.get("/conversations");
      set({ conversations: res.data.myConversation, conversationsLoading: false });
    } catch (err) {
      console.log(err);
      set({ conversationsLoading: false });
    }
  },

  openConversation: async (conversationId) => {
    set({ messagesLoading: true, messages: [] });

    const socket = connectSocket();
    socket.emit("joinConversation", conversationId);

    try {
      const res = await axiosInstance.get(`/conversations/${conversationId}/messages`);
      const conv = get().conversations.find((c) => c._id === conversationId) || null;
      set({
        activeConversation: conv,
        messages: res.data.messages,
        messagesLoading: false,
      });
    } catch (err) {
      console.log(err);
      set({ messagesLoading: false });
    }
  },

  sendMessage: async (conversationId, content) => {
    try {
      const res = await axiosInstance.post(`/conversations/${conversationId}/messages`, {
        content,
      });
      // socket "newMessage" listener (set up once at app level) handles appending to state
      return res.data.message;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  receiveMessage: (newMessage) => {
    const { activeConversation, messages, conversations } = get();

    if (activeConversation && newMessage.conversation === activeConversation._id) {
      set({ messages: [...messages, newMessage] });
    }

    set({
      conversations: conversations
        .map((c) =>
          c._id === newMessage.conversation
            ? { ...c, lastMessage: { text: newMessage.content, sender: newMessage.sender, sentAt: newMessage.createdAt } }
            : c
        )
        .sort((a, b) => new Date(b.lastMessage?.sentAt || 0) - new Date(a.lastMessage?.sentAt || 0)),
    });
  },

  startConversation: async (recipientId, gigId) => {
    const res = await axiosInstance.post("/conversations", { recipientId, gigId });
    const conv = res.data.conversation;

    const exists = get().conversations.some((c) => c._id === conv._id);
    if (!exists) {
      set({ conversations: [conv, ...get().conversations] });
    }
    return conv;
  },

  clearActiveConversation: () => set({ activeConversation: null, messages: [] }),
}));