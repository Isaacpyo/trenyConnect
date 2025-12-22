"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebaseClient";

export default function SignUpClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, form.email, form.password);
      const idToken = await cred.user.getIdToken(true);

      // Your server currently blocks non-admins.
      // So this will likely return 403 unless you change your rules.
      const r = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!r.ok) {
        await signOut(firebaseAuth);
        const data = await r.json().catch(() => ({}));
        throw new Error(data?.error || "Registration not allowed. Contact support.");
      }

      router.replace("/admin");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Sign-up failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] grid place-items-center px-4 py-10">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl border bg-white p-6 shadow-md grid gap-3">
        <h1 className="text-2xl font-semibold">Create account</h1>

        <label className="block">
          <div className="text-sm mb-1 text-gray-700">Email</div>
          <input
            className="field"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </label>

        <label className="block">
          <div className="text-sm mb-1 text-gray-700">Password</div>
          <input
            className="field"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
        </label>

        <button className="btn-brand disabled:opacity-50" disabled={loading} type="submit">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </main>
  );
}
