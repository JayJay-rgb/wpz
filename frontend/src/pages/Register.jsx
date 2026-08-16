import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import GoogleAuthButton from "../components/GoogleAuthButton";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axiosInstance.post("/register", { name, email, password });
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-paper-dark px-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Ticket stub header */}
        <div className="flex justify-between items-center px-6 py-3 border-2 border-b-0 border-dashed border-ink/20 dark:border-white/20 rounded-t-lg">
          <span className="font-display text-lg font-semibold text-ink dark:text-paper">
            WPZ
          </span>
          <span className="font-mono text-xs text-ink/50 dark:text-paper/50 tracking-wider">
            NEW ACCOUNT
          </span>
        </div>

        {/* Ticket body */}
        <div className="border-2 border-ink/20 dark:border-white/20 rounded-b-lg bg-white dark:bg-ink/40 px-8 py-10 shadow-sm">
          <h1 className="font-display text-3xl font-medium text-ink dark:text-paper mb-2">
            Find your next gig
          </h1>
          <p className="text-sm text-ink/60 dark:text-paper/60 mb-8">
            Create an account to start bidding or posting work.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink/50 dark:text-paper/50 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-md border border-ink/20 dark:border-white/20 bg-transparent text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                placeholder="Jane Doe"
              />
            </div>
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
                placeholder="At least 8 characters"
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-ink/10 dark:bg-white/10" />
            <span className="font-mono text-xs uppercase text-ink/40 dark:text-paper/40">
              or
            </span>
            <div className="flex-1 h-px bg-ink/10 dark:bg-white/10" />
          </div>

          <GoogleAuthButton label="Sign up with Google" />

          <p className="text-sm text-center text-ink/60 dark:text-paper/60 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;