import { io } from "socket.io-client";
import { useAuthStore } from "../store/authStore";

let socket = null;

export function getSocket() {
  if (!socket) {
    const { accessToken } = useAuthStore.getState();
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: accessToken },
      autoConnect: false,
    });
  }
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}