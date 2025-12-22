"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/common/Button";
import { useAppContext } from "@/hooks/useAppContext";
import { logout } from "@/lib/auth";
import {
  getUserProfile,
  upsertUserProfile,
  updateUserProfile,
  type UserProfile,
} from "@/lib/profile";

type TabKey = "overview" | "account" | "security" | "billing";

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-2 text-sm rounded-md border transition",
        active ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function ProfilePage() {
  const { user, loading } = useAppContext();
  const router = useRouter();

  const [tab, setTab] = useState<TabKey>("overview");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const uid = user?.uid;
  const email = user?.email || "";

  // Guard
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // Load profile
  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!uid || !email) return;

      setProfileLoading(true);

      const existing = await getUserProfile(uid);

      if (!existing) {
        const base: UserProfile = {
          uid,
          email,
          role: "user",
          createdAt: new Date(),
        };
        await upsertUserProfile(base);
        if (mounted) setProfile(base);
      } else {
        if (mounted) setProfile(existing);
      }

      setProfileLoading(false);
    }

    if (uid) loadProfile();

    return () => {
      mounted = false;
    };
  }, [uid, email]);

  const initials = useMemo(() => {
    const name = profile?.displayName || email;
    if (!name) return "?";
    const parts = name.split(" ").filter(Boolean);
    return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
  }, [profile?.displayName, email]);

  if (loading || profileLoading) return <div className="p-8">Loading…</div>;
  if (!user || !profile) return null;

  async function onSaveProfile() {
    if (!uid || !profile) return;
    setSaving(true);
    try {
      await updateUserProfile(uid, {
        displayName: profile.displayName || "",
        phone: profile.phone || "",
      });
    } finally {
      setSaving(false);
    }
  }

  async function onLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <section className="max-w-4xl mx-auto p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-gray-600">Manage your account and preferences.</p>
        </div>
        <Button onClick={onLogout} disabled={loggingOut}>
          {loggingOut ? "Logging out..." : "Log out"}
        </Button>
      </div>

      <div className="rounded-xl border bg-white">
        {/* Header */}
        <div className="p-5 border-b flex items-center gap-4">
          <div className="h-16 w-16 rounded-full border flex items-center justify-center font-semibold">
            {initials}
          </div>

          <div className="min-w-0">
            <div className="font-semibold truncate">
              {profile.displayName || "No name set"}
            </div>
            <div className="text-sm text-gray-600 truncate">{profile.email}</div>
            <div className="text-xs text-gray-500 mt-1">
              Role: <span className="font-medium">{profile.role || "user"}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b flex flex-wrap gap-2">
          <TabButton active={tab === "overview"} onClick={() => setTab("overview")}>
            Overview
          </TabButton>
          <TabButton active={tab === "account"} onClick={() => setTab("account")}>
            Account
          </TabButton>
          <TabButton active={tab === "security"} onClick={() => setTab("security")}>
            Security
          </TabButton>
          <TabButton active={tab === "billing"} onClick={() => setTab("billing")}>
            Billing
          </TabButton>
        </div>

        {/* Content */}
        <div className="p-5">
          {tab === "overview" && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Display name</label>
                  <input
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                    value={profile.displayName || ""}
                    onChange={(e) =>
                      setProfile((p) => (p ? { ...p, displayName: e.target.value } : p))
                    }
                    placeholder="e.g., Temitope Agbola"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                    value={profile.phone || ""}
                    onChange={(e) =>
                      setProfile((p) => (p ? { ...p, phone: e.target.value } : p))
                    }
                    placeholder="e.g., +44..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={onSaveProfile} disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
                <span className="text-xs text-gray-500">
                  Email is managed by authentication, not editable here.
                </span>
              </div>
            </div>
          )}

          {tab === "account" && (
            <div className="space-y-3">
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium mb-1">Account details</div>
                <p className="text-sm text-gray-600">
                  UID: <span className="font-mono">{profile.uid}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Email: <span className="font-medium">{profile.email}</span>
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium mb-1">Danger zone</div>
                <p className="text-sm text-gray-600">
                  Add “delete account” only after you implement server-side cleanup.
                </p>
              </div>
            </div>
          )}

          {tab === "security" && (
            <div className="space-y-3">
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium mb-1">Password / providers</div>
                <p className="text-sm text-gray-600">
                  Add reset-password flows and linked providers here.
                </p>
              </div>
            </div>
          )}

          {tab === "billing" && (
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium mb-1">Billing</div>
              <p className="text-sm text-gray-600">
                Stripe plan, invoices, and subscription management goes here.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
