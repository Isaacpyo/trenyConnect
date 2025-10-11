"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: .25 } };

  function oauth(provider: "google" | "microsoft" | "apple") {
    // TODO: Wire to your auth (e.g., NextAuth's `signIn(provider)`)
    window.location.href = `/api/auth/${provider}`; // placeholder
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: email/password sign-up
      await new Promise(r => setTimeout(r, 800));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-10">
      <motion.div
        {...fade}
        className="w-full max-w-md rounded-3xl border bg-white/80 backdrop-blur p-6 sm:p-8 shadow-md"
      >
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">Create your account</h1>
          <p className="text-gray-600 mt-1">Book shipments faster and track them in one place.</p>
        </div>

        <div className="grid gap-2 sm:gap-3">
          <OAuthButton provider="google" onClick={() => oauth("google")} />
          <OAuthButton provider="microsoft" onClick={() => oauth("microsoft")} />
          <OAuthButton provider="apple" onClick={() => oauth("apple")} />
        </div>

        <Divider label="or sign up with email" />

        <form onSubmit={onSubmit} className="grid gap-3">
          <LabelInput
            label="Full name"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          />
          <LabelInput
            type="email"
            label="Email address"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          />
          <div className="relative">
            <LabelInput
              label="Password"
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={(v) => setForm((f) => ({ ...f, password: v }))}
            />
            <button
              type="button"
              onClick={() => setShowPw(s => !s)}
              className="absolute right-3 top-8 text-xs text-gray-500 underline"
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>

          <p className="text-xs text-gray-500">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link> and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-brand mt-1 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create account"}
          </motion.button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account? <Link href="/auth/sign-in" className="underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

/* Reuse the helper bits from sign-in (duplicated for a single-file paste) */
function LabelInput({
  label, value, onChange, type = "text", placeholder,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <div className="text-sm mb-1 text-gray-700">{label}</div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </label>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

function OAuthButton({
  provider, onClick,
}: { provider: "google" | "microsoft" | "apple"; onClick: () => void }) {
  const map = {
    google: { label: "Continue with Google", Icon: GoogleIcon },
    microsoft: { label: "Continue with Microsoft", Icon: MicrosoftIcon },
    apple: { label: "Continue with Apple", Icon: AppleIcon },
  } as const;
  const { label, Icon } = map[provider];

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm text-sm flex items-center justify-center gap-2 hover:border-brand hover:ring-2 hover:ring-brand/20 transition"
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}

/* Same inline SVG icons */
function GoogleIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-1.6 3.6-5.4 3.6-3.2 0-5.8-2.7-5.8-6S8.8 5.8 12 5.8c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.8 3.3 14.6 2.5 12 2.5 6.9 2.5 2.8 6.6 2.8 11.7S6.9 20.9 12 20.9c6.3 0 8.7-4.4 8.7-6.7 0-.5-.1-.9-.1-1H12z"/>
    </svg>
  );
}
function MicrosoftIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 23 23" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#7FBA00" d="M12 1h10v10H12z"/>
      <path fill="#00A4EF" d="M1 12h10v10H1z"/><path fill="#FFB900" d="M12 12h10v10H12z"/>
    </svg>
  );
}
function AppleIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.42 2.1-1.07 2.83-.77.88-2.03 1.56-3.31 1.47-.1-1.08.47-2.2 1.18-2.9.79-.79 2.2-1.37 3.2-1.4zM20.9 17.21c-.55 1.28-.82 1.85-1.54 2.98-1 1.53-2.39 3.42-4.12 3.44-1.54.02-1.94-.99-4.04-.99-2.11 0-2.54 1-4.09 1.01-1.74.02-3.06-1.75-4.06-3.27-2.79-4.28-3.08-9.31-1.36-11.96 1.21-1.87 3.13-3.05 5.29-3.08 2.06-.04 3.35 1.04 5.04 1.04 1.68 0 2.71-1.04 5.06-.99 1.81.03 3.72.99 4.91 2.68-4.3 2.29-3.61 7.99-.09 9.14z"/>
    </svg>
  );
}
