import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

const TYPE_LABELS = {
  new_bid: "New Bid",
  bid_accepted: "Bid Accepted",
  bid_rejected: "Bid Rejected",
  new_message: "New Message",
  gig_status_changed: "Gig Updated",
};

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,

  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/notifications");
      set({ notifications: res.data.notifications, loading: false });
    } catch (err) {
      console.log(err);
      set({ loading: false });
    }
  },

  markRead: async (notificationId) => {
    // optimistic update
    set({
      notifications: get().notifications.map((n) =>
        n._id === notificationId ? { ...n, read: true } : n
      ),
    });
    try {
      await axiosInstance.patch(`/notifications/${notificationId}/read`);
    } catch (err) {
      console.log(err);
    }
  },

  receiveNotification: (newNotification) => {
    set({ notifications: [newNotification, ...get().notifications] });
  },
}));

export { TYPE_LABELS };