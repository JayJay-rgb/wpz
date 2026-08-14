import { create } from "zustand";
import { disconnectSocket } from "../lib/socket";
import api from "../api/axiosInstance.js"; // adjust path to your axios instance

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  authChecked: false, // true once we've attempted bootstrap, success or fail

  setAuth: (user, accessToken) => set({ user, accessToken }),

  clearAuth: () => {
    disconnectSocket();
    set({ user: null, accessToken: null });
  },

  bootstrapAuth: async () => {
    try {
      const refreshRes = await api.post("/auth/refresh"); // adjust route if needed
      const { accessToken } = refreshRes.data;

      const meRes = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      set({ user: meRes.data, accessToken, authChecked: true });
    } catch (err) {
      // No valid session — expected for logged-out visitors, not an error to surface
      set({ user: null, accessToken: null, authChecked: true });
    }
  },
}));