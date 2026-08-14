import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import axiosInstance from "../api/axiosInstance";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (err) {
      console.log(err);
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  return (
    <nav className="border-b-2 border-dashed border-ink/20 dark:border-white/20 bg-paper dark:bg-paper-dark px-6 py-4 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold text-ink dark:text-paper">
          WPZ
        </Link>

        <div className="flex items-center gap-6">
          <NotificationBell />
          {user ? (
            <>
              <Link
                to="/gigs/new"
                className="text-sm font-mono uppercase tracking-wider text-ink/70 dark:text-paper/70 hover:text-primary transition"
              >
                Post a gig
              </Link>
              <Link
                to="/my-bids"
                className="text-sm font-mono uppercase tracking-wider text-ink/70 dark:text-paper/70 hover:text-primary transition"
              >
                My bids
              </Link>
              <Link
                to="/my-gigs"
                className="text-sm font-mono uppercase tracking-wider text-ink/70 dark:text-paper/70 hover:text-primary transition"
              >
                My gigs
              </Link>
              <Link
                to="/messages"
                className="text-sm font-mono uppercase tracking-wider text-ink/70 dark:text-paper/70 hover:text-primary transition"
              >
                Messages
              </Link>
              <Link
                to={`/users/${user._id}`}
                className="text-sm font-mono uppercase tracking-wider text-ink/70 dark:text-paper/70 hover:text-primary transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-mono uppercase tracking-wider text-primary hover:opacity-70 transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-mono uppercase tracking-wider text-ink/70 dark:text-paper/70 hover:text-primary transition"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-mono uppercase tracking-wider bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
              >
                Sign up
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;