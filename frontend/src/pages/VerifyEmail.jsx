import { useState,useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
  if (!email) {
    navigate("/register", { replace: true });
  }
}, [email, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits allowed

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1); // only keep last typed char
    setDigits(newDigits);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (pasted.length === 5) {
      setDigits(pasted.split(""));
      inputRefs.current[4]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const pin = digits.join("");

    if (pin.length !== 5) {
      setError("Enter all 5 digits");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/verify-email", { email, pin });
      setVerified(true);
      setTimeout(() => navigate("/login"), 1600);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMessage("");
    setError("");
    try {
      await axiosInstance.post("/resend-verification", { email });
      setResendMessage("New code sent");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't resend code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-paper-dark px-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-3 border-2 border-b-0 border-dashed border-ink/20 dark:border-white/20 rounded-t-lg">
          <span className="font-display text-lg font-semibold text-ink dark:text-paper">
            WPZ
          </span>
          <span className="font-mono text-xs text-ink/50 dark:text-paper/50 tracking-wider">
            VERIFY
          </span>
        </div>

        <div className="relative border-2 border-ink/20 dark:border-white/20 rounded-b-lg bg-white dark:bg-ink/40 px-8 py-10 shadow-sm overflow-hidden">
          {/* Stamp overlay */}
          {verified && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-ink/70 z-10">
              <div className="animate-stamp border-4 border-stamp text-stamp font-display font-bold text-2xl rounded-full w-32 h-32 flex items-center justify-center rotate-[-12deg] tracking-wide">
                VERIFIED
              </div>
            </div>
          )}

          <h1 className="font-display text-3xl font-medium text-ink dark:text-paper mb-2">
            Check your email
          </h1>
          <p className="text-sm text-ink/60 dark:text-paper/60 mb-8">
            Enter the 5-digit code sent to{" "}
            <span className="font-mono text-ink dark:text-paper">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-mono border border-ink/20 dark:border-white/20 rounded-md bg-transparent text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                />
              ))}
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}
            {resendMessage && (
              <p className="text-sm text-stamp text-center">{resendMessage}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {loading ? "Verifying..." : "Verify account"}
            </button>
          </form>

          <p className="text-sm text-center text-ink/60 dark:text-paper/60 mt-6">
            Didn't get a code?{" "}
            <button onClick={handleResend} className="text-primary font-medium">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;