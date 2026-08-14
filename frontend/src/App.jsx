import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import useThemeStore from "./store/themeStore.js";
import { useAuthStore } from "./store/authStore";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import GigFeed from "./pages/GigFeed";
import GigDetail from "./pages/GigDetail";
import CreateGig from "./pages/CreateGig";
import MyBids from "./pages/MyBids";
import MyGigs from "./pages/MyGigs";
import UserProfile from "./pages/UserProfile";
import Conversations from "./pages/Messages";

function App() {
  const initTheme = useThemeStore((state) => state.initTheme);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    initTheme();

const bootstrapAuth = async () => {
  try {
    const refreshRes = await axios.post(
      "http://localhost:8000/v1/refresh",
      {},
      { withCredentials: true }
    );
    const { accessToken } = refreshRes.data;

    const meRes = await axios.get("http://localhost:8000/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    setAuth(meRes.data, accessToken);
  } catch (err) {
    clearAuth();
  } finally {
    setAuthChecked(true);
  }
};

    bootstrapAuth();
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <p className="font-[IBM_Plex_Mono] text-xs text-[var(--color-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<GigFeed />} />
        <Route path="/gigs/:id" element={<GigDetail />} />
        <Route path="/users/:userId" element={<UserProfile />} />

        {/* Protected */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gigs/new"
          element={
            <ProtectedRoute>
              <CreateGig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bids"
          element={
            <ProtectedRoute>
              <MyBids />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-gigs"
          element={
            <ProtectedRoute>
              <MyGigs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Conversations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:conversationId"
          element={
            <ProtectedRoute>
              <Conversations />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
