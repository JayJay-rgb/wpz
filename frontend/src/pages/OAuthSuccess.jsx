// pages/OAuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../api/axiosInstance";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    const finishLogin = async () => {
      try {
        const meRes = await api.get("/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setAuth(meRes.data, accessToken);
        navigate("/");
      } catch (err) {
        navigate("/login");
      }
    };

    finishLogin();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <p className="font-[IBM_Plex_Mono] text-xs text-[var(--color-muted)]">Signing you in...</p>
    </div>
  );
}