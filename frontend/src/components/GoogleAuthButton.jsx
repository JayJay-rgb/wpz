const GoogleAuthButton = ({ label = "Continue with Google" }) => {
  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL_ROOT}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className="w-full flex items-center justify-center gap-3 border-2 border-ink/20 dark:border-white/20 rounded-md py-2.5 px-4 font-mono text-sm uppercase tracking-wider text-ink dark:text-paper hover:bg-[var(--color-surface)] transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.4-.4-3.5z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3c-7.7 0-14.4 4.4-17.7 10.7z"/>
        <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36.2 26.7 37 24 37c-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.5 40.6 16.2 45 24 45z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C40.9 36 44 30.5 44 24c0-1.4-.1-2.4-.4-3.5z"/>
      </svg>
      {label}
    </button>
  );
};

export default GoogleAuthButton;