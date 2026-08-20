import { create } from "zustand";
import { disconnectSocket } from "../lib/socket";
import axiosInstance from "../api/axiosInstance.js";

let bootstrapPromise = null;

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  authChecked: false,

  setAuth: (user, accessToken) => set({ user, accessToken }),

  clearAuth: () => {
    disconnectSocket();
    set({
      user: null,
      accessToken: null,
      authChecked: true,
    });
  },

  bootstrapAuth: async () => {
    if (get().authChecked) return;

    // Prevent duplicate refresh requests
    if (bootstrapPromise) return bootstrapPromise;

    bootstrapPromise = (async () => {
      try {
        const refreshRes = await axiosInstance.post("/refresh");
        const { accessToken } = refreshRes.data;

        const meRes = await axiosInstance.get("/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const user = meRes.data.user ?? meRes.data;

        set({
          user,
          accessToken,
          authChecked: true,
        });
      } catch (err) {
        set({
          user: null,
          accessToken: null,
          authChecked: true,
        });
      } finally {
        bootstrapPromise = null;
      }
    })();

    return bootstrapPromise;
  },
}));