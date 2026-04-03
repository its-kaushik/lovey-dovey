"use client";

import { useState, type FormEvent } from "react";

interface PasswordGateProps {
  onSuccess: () => void;
}

export default function PasswordGate({ onSuccess }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [errorType, setErrorType] = useState<
    "incorrect" | "network" | null
  >(null);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || !password.trim()) return;

    setLoading(true);
    setErrorType(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        setErrorType("incorrect");
        setAttempts((prev) => prev + 1);
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
      }
    } catch {
      setErrorType("network");
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Envelope / card container */}
        <div className="rounded-2xl border border-rose-gold/20 bg-midnight-deep/80 p-8 shadow-lg shadow-rose-gold/5 backdrop-blur-sm [-webkit-backdrop-filter:blur(4px)]">
          {/* Lock icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-rose-gold/30 text-3xl">
            <span role="img" aria-label="lock">
              &hearts;
            </span>
          </div>

          <h1 className="mb-2 text-center font-[family-name:var(--font-playfair-display)] text-2xl text-cream">
            This is for you
          </h1>
          <p className="mb-8 text-center font-[family-name:var(--font-caveat)] text-lg text-lavender">
            But first... prove it&apos;s you.
          </p>

          <form onSubmit={handleSubmit}>
            <div className={shaking ? "animate-shake" : ""}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the password..."
                autoFocus
                className="w-full rounded-xl border border-rose-gold/30 bg-midnight px-4 py-3 text-cream placeholder-lavender/50 outline-none transition-colors focus:border-rose-gold/60"
              />
            </div>

            {/* Error messages */}
            {errorType === "incorrect" && (
              <p className="mt-3 text-center text-sm text-blush">
                That&apos;s not it. Try again.
              </p>
            )}
            {errorType === "network" && (
              <p className="mt-3 text-center text-sm text-warm-gold">
                Something went wrong. Try again?
              </p>
            )}

            {/* Hint — only after 3 incorrect attempts */}
            {attempts >= 3 && (
              <p className="mt-3 text-center font-[family-name:var(--font-caveat)] text-sm text-warm-gold/80 transition-opacity duration-500">
                Hint: What does he call you that means goddess?
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="mt-6 w-full min-h-[44px] rounded-xl border border-rose-gold/40 bg-rose-gold/10 px-4 py-3 font-[family-name:var(--font-playfair-display)] text-rose-gold transition-all hover:bg-rose-gold/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Open"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
