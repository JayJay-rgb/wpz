import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuthStore } from "../store/authStore";

const Onboarding = () => {
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  const completeOnboarding = async (payload) => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.patch("/profile", {
        ...payload,
        hasCompletedOnboarding: true,
      });
      setAuth(response.data.user, accessToken);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => completeOnboarding({});
  const handleSave = () => completeOnboarding({ bio });

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-paper-dark px-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-3 border-2 border-b-0 border-dashed border-ink/20 dark:border-white/20 rounded-t-lg">
          <span className="font-display text-lg font-semibold text-ink dark:text-paper">
            WPZ
          </span>
          <span className="font-mono text-xs text-ink/50 dark:text-paper/50 tracking-wider">
            STEP 1 OF 1
          </span>
        </div>

        <div className="border-2 border-ink/20 dark:border-white/20 rounded-b-lg bg-white dark:bg-ink/40 px-8 py-10 shadow-sm">
          <h1 className="font-display text-3xl font-medium text-ink dark:text-paper mb-2">
            Tell people what you do
          </h1>
          <p className="text-sm text-ink/60 dark:text-paper/60 mb-8">
            A short bio helps clients and freelancers know who they're working with. You can always add this later from your profile.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink/50 dark:text-paper/50 mb-1.5">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="I'm a full-stack developer who loves building..."
                className="w-full px-4 py-2.5 rounded-md border border-ink/20 dark:border-white/20 bg-transparent text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                disabled={loading}
                className="flex-1 py-3 rounded-md border border-ink/20 dark:border-white/20 text-ink dark:text-paper font-semibold hover:bg-ink/5 dark:hover:bg-white/5 disabled:opacity-50 transition"
              >
                Skip for now
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !bio.trim()}
                className="flex-1 py-3 rounded-md bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 transition"
              >
                {loading ? "Saving..." : "Save & continue"}
              </button>
            </div>
          </div>

          <p className="text-xs text-center text-ink/40 dark:text-paper/40 mt-6">
            Want to add portfolio work too? Head to your profile anytime after this.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;