import { create } from "zustand";
import { disconnectSocket } from "../lib/socket";
import api from "../api/axiosInstance.js";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  authChecked: false,

  setAuth: (user, accessToken) => set({ user, accessToken }),

  clearAuth: () => {
    disconnectSocket();
    set({ user: null, accessToken: null });
  },

  bootstrapAuth: async () => {
    try {
      const refreshRes = await api.post("/refresh");
      const { accessToken } = refreshRes.data;

      const meRes = await api.get("/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      set({ user: meRes.data, accessToken, authChecked: true });
    } catch (err) {
      set({ user: null, accessToken: null, authChecked: true });
    }
  },
}));