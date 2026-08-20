import { create } from "zustand";
import { disconnectSocket } from "../lib/socket";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getStoredUser(),
  accessToken: localStorage.getItem("accessToken"),
  authChecked: false,

  setAuth: (user, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    set({ user, accessToken, authChecked: true });
  },

  clearAuth: () => {
    disconnectSocket();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    set({
      user: null,
      accessToken: null,
      authChecked: true,
    });
  },

  bootstrapAuth: async () => {
    set({
      user: getStoredUser(),
      accessToken: localStorage.getItem("accessToken"),
      authChecked: true,
    });
  },
}));

const setAuth = useAuthStore((state) => state.setAuth);

// After a successful login request:
setAuth(response.data.user, response.data.accessToken);