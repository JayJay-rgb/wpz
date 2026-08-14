import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth", { email, password });
      const { accessToken } = response.data;

      setAuth(null, accessToken);

      const meResponse = await axiosInstance.get("/me");
      setAuth(meResponse.data.user, accessToken);

      if (!meResponse.data.user.hasCompletedOnboarding) {
        navigate("/onboarding");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-paper-dark px-4 transition-colors">
      <div className="w-full max-w-md">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onAnimationEnd={() => setHasEntered(true)}
          className={`transition-transform duration-200 ease-out will-change-transform ${
            hasEntered ? "" : "animate-ticket-in"
          }`}
        >
          <div className="flex justify-between items-center px-6 py-3 border-2 border-b-0 border-dashed border-ink/20 dark:border-white/20 rounded-t-lg bg-white/40 dark:bg-ink/40 backdrop-blur-sm">
            <span className="font-display text-lg font-semibold text-ink dark:text-paper">
              WPZ
            </span>
            <span className="font-mono text-xs text-ink/50 dark:text-paper/50 tracking-wider">
              SIGN IN
            </span>
          </div>

          <div className="border-2 border-ink/20 dark:border-white/20 rounded-b-lg bg-white dark:bg-ink/40 px-8 py-10 shadow-lg">
            <h1 className="font-display text-3xl font-medium text-ink dark:text-paper mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-ink/60 dark:text-paper/60 mb-8">
              Log in to browse gigs and manage your bids.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink/50 dark:text-paper/50 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-md border border-ink/20 dark:border-white/20 bg-transparent text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink/50 dark:text-paper/50 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-md border border-ink/20 dark:border-white/20 bg-transparent text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-md bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 transition"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <p className="text-sm text-center text-ink/60 dark:text-paper/60 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;